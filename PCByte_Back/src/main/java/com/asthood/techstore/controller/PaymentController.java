package com.asthood.techstore.controller;

import com.asthood.techstore.dto.*;
import com.asthood.techstore.model.*;
import com.asthood.techstore.repository.OrderRepository;
import com.asthood.techstore.repository.ProductRepository;
import com.asthood.techstore.repository.UserRepository;
import com.asthood.techstore.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @PostMapping("/create_preference")
    public ResponseEntity<PaymentResponseDTO> create(@RequestBody OrderRequestDTO orderRequest) {
        try {
            // 1. LÓGICA DE SEPARACIÓN DE NOMBRE (Final para la Lambda)
            String rawName = orderRequest.getPayer().getName() != null ? orderRequest.getPayer().getName().trim() : "Invitado";

            final String firstName;
            final String lastName;

            if (rawName.contains(" ")) {
                int firstSpaceIndex = rawName.indexOf(" ");
                firstName = rawName.substring(0, firstSpaceIndex).trim();
                lastName = rawName.substring(firstSpaceIndex).trim();
            } else {
                firstName = rawName;
                lastName = "";
            }

            // 2. Lógica de Usuario Único (Ya no dará error de 'effectively final')
            User orderUser = userRepository.findByEmail(orderRequest.getPayer().getEmail())
                    .map(user -> {
                        log.info("Actualizando usuario existente: {}", user.getEmail());
                        user.setFirstName(firstName);
                        user.setLastName(lastName);
                        user.setPhone(orderRequest.getPayer().getPhone());
                        return userRepository.save(user);
                    })
                    .orElseGet(() -> {
                        log.info("Creando nuevo usuario invitado: {}", orderRequest.getPayer().getEmail());
                        return userRepository.save(User.builder()
                                .email(orderRequest.getPayer().getEmail())
                                .firstName(firstName)
                                .lastName(lastName)
                                .phone(orderRequest.getPayer().getPhone())
                                .status(UserStatus.INVITADO)
                                .build());
                    });

            // 3. Crear la Orden con Snapshot detallado (Dirección desglosada)
            Order newOrder = Order.builder()
                    .user(orderUser)
                    .fullName(rawName) // Guardamos el nombre completo original en la orden
                    .email(orderRequest.getPayer().getEmail())
                    .phone(orderRequest.getPayer().getPhone())
                    .street(orderRequest.getPayer().getStreet())
                    .number(orderRequest.getPayer().getNumber())
                    .apartment(orderRequest.getPayer().getApartment())
                    .city(orderRequest.getPayer().getCity())
                    .region(orderRequest.getPayer().getRegion())
                    .extraInfo(orderRequest.getPayer().getExtraInfo())
                    .total(BigDecimal.valueOf(orderRequest.getTotal()))
                    .status(OrderStatus.PENDIENTE)
                    .build();

            Order savedOrder = orderRepository.save(newOrder);

            // 4. Agregar Items a la orden
            for (CartItemDTO item : orderRequest.getItems()) {
                OrderItem orderItem = OrderItem.builder()
                        .order(savedOrder)
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build();

                productRepository.findById(item.getProductId())
                        .ifPresent(orderItem::setProduct);

                savedOrder.addOrderItem(orderItem);
            }
            orderRepository.save(savedOrder);

            // 5. Integración con Mercado Pago
            String checkoutUrl = paymentService.createPreference(orderUser, orderRequest.getItems(), savedOrder.getId());

            return ResponseEntity.ok(new PaymentResponseDTO(checkoutUrl));

        } catch (Exception e) {
            log.error("❌ Error crítico en el proceso de pago: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/success")
    public RedirectView redirectAfterPayment(
            @RequestParam(name = "payment_id", required = false) String paymentId,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "external_reference", required = false) String externalReference) {

        // Tu IP local para pruebas en red
        String FRONTEND_URL = "http://192.168.100.226:5173";

        String frontendUrl = String.format(
                "%s/success?payment_id=%s&status=%s&external_reference=%s",
                FRONTEND_URL,
                paymentId != null ? paymentId : "",
                status != null ? status : "",
                externalReference != null ? externalReference : ""
        );

        return new RedirectView(frontendUrl);
    }

    @GetMapping("/latest/{userId}")
    public ResponseEntity<Order> getLatestOrder(@PathVariable Long userId) {
        return orderRepository.findFirstByUserIdOrderByIdDesc(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> receiveWebhook(
            @RequestParam(name = "topic", required = false) String topic,
            @RequestParam(name = "id", required = false) String id,
            @RequestParam(name = "data.id", required = false) String dataId,
            @RequestParam(name = "type", required = false) String type) {

        String paymentId = (id != null) ? id : dataId;
        String finalTopic = (topic != null) ? topic : type;

        if ("payment".equals(finalTopic) && paymentId != null && !paymentId.isEmpty()) {
            try {
                paymentService.processWebhook(finalTopic, paymentId);
            } catch (Exception e) {
                log.error("❌ Error procesando webhook de Mercado Pago: ", e);
            }
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        log.info("Buscando detalles de la orden ID: {}", id);
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.error("Orden con ID {} no encontrada", id);
                    return ResponseEntity.notFound().build();
                });
    }
}