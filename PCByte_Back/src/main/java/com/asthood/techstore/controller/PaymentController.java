package com.asthood.techstore.controller;

import com.asthood.techstore.dto.CartItemDTO;
import com.asthood.techstore.dto.OrderRequestDTO;
import com.asthood.techstore.dto.PaymentResponseDTO;
import com.asthood.techstore.model.Order;
import com.asthood.techstore.model.OrderItem;
import com.asthood.techstore.model.OrderStatus;
import com.asthood.techstore.domain.entity.Product;
import com.asthood.techstore.model.User;
import com.asthood.techstore.model.UserStatus;
import com.asthood.techstore.repository.OrderRepository;
import com.asthood.techstore.repository.ProductRepository;
import com.asthood.techstore.repository.UserRepository;
import com.asthood.techstore.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

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

    @Value("${app.frontend-url}")
    private String frontendUrl;

    // =========================================================
    // CREAR ORDEN Y PREFERENCIA DE MERCADO PAGO
    // =========================================================

    @PostMapping("/create_preference")
    public ResponseEntity<PaymentResponseDTO> create(
            @RequestBody OrderRequestDTO orderRequest
    ) {
        try {
            validateOrderRequest(orderRequest);

            String rawName = normalizeName(
                    orderRequest.getPayer().getName()
            );

            String[] separatedName = separateName(rawName);

            String firstName = separatedName[0];
            String lastName = separatedName[1];

            String email = orderRequest
                    .getPayer()
                    .getEmail()
                    .trim()
                    .toLowerCase();

            User orderUser = userRepository
                    .findByEmail(email)
                    .map(user -> updateExistingUser(
                            user,
                            firstName,
                            lastName,
                            orderRequest
                    ))
                    .orElseGet(() -> createGuestUser(
                            email,
                            firstName,
                            lastName,
                            orderRequest
                    ));

            Order newOrder = Order.builder()
                    .user(orderUser)
                    .fullName(rawName)
                    .email(email)
                    .phone(orderRequest.getPayer().getPhone())
                    .street(orderRequest.getPayer().getStreet())
                    .number(orderRequest.getPayer().getNumber())
                    .apartment(orderRequest.getPayer().getApartment())
                    .city(orderRequest.getPayer().getCity())
                    .region(orderRequest.getPayer().getRegion())
                    .extraInfo(orderRequest.getPayer().getExtraInfo())
                    .total(BigDecimal.ZERO)
                    .status(OrderStatus.PENDIENTE)
                    .build();

            Order savedOrder = orderRepository.save(newOrder);

            BigDecimal calculatedTotal = addOrderItems(
                    savedOrder,
                    orderRequest.getItems()
            );

            savedOrder.setTotal(calculatedTotal);

            Order completedOrder = orderRepository.save(savedOrder);

            String checkoutUrl = paymentService.createPreference(
                    orderRequest.getItems(),
                    completedOrder.getId()
            );

            log.info(
                    "Preferencia creada para la orden #{} por un total de ${}",
                    completedOrder.getId(),
                    calculatedTotal
            );

            return ResponseEntity.ok(
                    new PaymentResponseDTO(checkoutUrl)
            );

        } catch (IllegalArgumentException exception) {
            log.warn(
                    "Solicitud de pago rechazada: {}",
                    exception.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .build();

        } catch (Exception exception) {
            log.error(
                    "Error crítico al crear la preferencia de pago",
                    exception
            );

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }

    // =========================================================
    // RETORNO DESDE MERCADO PAGO
    // =========================================================

    @GetMapping("/success")
    public RedirectView redirectAfterPayment(
            @RequestParam(
                    name = "payment_id",
                    required = false
            ) String paymentId,

            @RequestParam(
                    name = "status",
                    required = false
            ) String status,

            @RequestParam(
                    name = "external_reference",
                    required = false
            ) String externalReference
    ) {
        String redirectUrl = UriComponentsBuilder
                .fromUriString(removeTrailingSlash(frontendUrl))
                .path("/success")
                .queryParam(
                        "payment_id",
                        paymentId != null ? paymentId : ""
                )
                .queryParam(
                        "status",
                        status != null ? status : ""
                )
                .queryParam(
                        "external_reference",
                        externalReference != null
                                ? externalReference
                                : ""
                )
                .build()
                .encode()
                .toUriString();

        log.info(
                "Redirigiendo retorno de Mercado Pago hacia: {}",
                redirectUrl
        );

        return new RedirectView(redirectUrl);
    }

    // =========================================================
    // WEBHOOK DE MERCADO PAGO
    // =========================================================

    @PostMapping("/webhook")
    public ResponseEntity<Void> receiveWebhook(
            @RequestParam(
                    name = "topic",
                    required = false
            ) String topic,

            @RequestParam(
                    name = "id",
                    required = false
            ) String id,

            @RequestParam(
                    name = "data.id",
                    required = false
            ) String dataId,

            @RequestParam(
                    name = "type",
                    required = false
            ) String type
    ) {
        String paymentId = firstNonBlank(id, dataId);
        String finalTopic = firstNonBlank(topic, type);

        if (paymentId == null || finalTopic == null) {
            log.info(
                    "Webhook ignorado por no contener tipo o ID de pago"
            );

            return ResponseEntity.ok().build();
        }

        if (!"payment".equalsIgnoreCase(finalTopic)) {
            log.info(
                    "Webhook ignorado. Tipo recibido: {}",
                    finalTopic
            );

            return ResponseEntity.ok().build();
        }

        try {
            log.info(
                    "Procesando webhook de Mercado Pago. Payment ID: {}",
                    paymentId
            );

            paymentService.processWebhook(
                    finalTopic,
                    paymentId
            );

            return ResponseEntity.ok().build();

        } catch (Exception exception) {
            log.error(
                    "Error procesando webhook de Mercado Pago. Payment ID: {}",
                    paymentId,
                    exception
            );

            /*
             * Respondemos con error para que Mercado Pago pueda
             * reintentar la notificación posteriormente.
             */
            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }

    // =========================================================
    // CONSULTAS DE ÓRDENES
    // =========================================================

    @GetMapping("/latest/{userId}")
    public ResponseEntity<Order> getLatestOrder(
            @PathVariable Long userId
    ) {
        return orderRepository
                .findFirstByUserIdOrderByIdDesc(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Long id
    ) {
        log.info(
                "Buscando detalles de la orden #{}",
                id
        );

        return orderRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn(
                            "Orden #{} no encontrada",
                            id
                    );

                    return ResponseEntity
                            .notFound()
                            .build();
                });
    }

    // =========================================================
    // MÉTODOS PRIVADOS
    // =========================================================

    private void validateOrderRequest(
            OrderRequestDTO orderRequest
    ) {
        if (orderRequest == null) {
            throw new IllegalArgumentException(
                    "La solicitud de compra es obligatoria."
            );
        }

        if (orderRequest.getPayer() == null) {
            throw new IllegalArgumentException(
                    "Los datos del comprador son obligatorios."
            );
        }

        if (
                orderRequest.getPayer().getEmail() == null
                        || orderRequest
                        .getPayer()
                        .getEmail()
                        .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El correo del comprador es obligatorio."
            );
        }

        if (
                orderRequest.getItems() == null
                        || orderRequest.getItems().isEmpty()
        ) {
            throw new IllegalArgumentException(
                    "La orden debe contener al menos un producto."
            );
        }
    }

    private BigDecimal addOrderItems(
            Order order,
            List<CartItemDTO> requestedItems
    ) {
        BigDecimal total = BigDecimal.ZERO;

        for (CartItemDTO requestedItem : requestedItems) {
            validateCartItem(requestedItem);

            Product product = productRepository
                    .findById(requestedItem.getProductId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "El producto con ID "
                                            + requestedItem.getProductId()
                                            + " no existe."
                            )
                    );

            if (
                    product.getStock() == null
                            || product.getStock()
                            < requestedItem.getQuantity()
            ) {
                throw new IllegalArgumentException(
                        "Stock insuficiente para el producto: "
                                + product.getName()
                );
            }

            BigDecimal unitPrice = product.getPrice();

            if (
                    unitPrice == null
                            || unitPrice.compareTo(BigDecimal.ZERO) <= 0
            ) {
                throw new IllegalArgumentException(
                        "El producto "
                                + product.getName()
                                + " no tiene un precio válido."
                );
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(requestedItem.getQuantity())
                    .price(unitPrice)
                    .build();

            order.addOrderItem(orderItem);

            BigDecimal itemSubtotal = unitPrice.multiply(
                    BigDecimal.valueOf(
                            requestedItem.getQuantity()
                    )
            );

            total = total.add(itemSubtotal);
        }

        return total;
    }

    private void validateCartItem(
            CartItemDTO item
    ) {
        if (item == null) {
            throw new IllegalArgumentException(
                    "La orden contiene un producto inválido."
            );
        }

        if (item.getProductId() == null) {
            throw new IllegalArgumentException(
                    "Todos los productos deben contener un ID."
            );
        }

        if (
                item.getQuantity() == null
                        || item.getQuantity() <= 0
        ) {
            throw new IllegalArgumentException(
                    "La cantidad del producto debe ser mayor que cero."
            );
        }
    }

    private User updateExistingUser(
            User user,
            String firstName,
            String lastName,
            OrderRequestDTO orderRequest
    ) {
        log.info(
                "Actualizando usuario existente: {}",
                user.getEmail()
        );

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(
                orderRequest.getPayer().getPhone()
        );

        return userRepository.save(user);
    }

    private User createGuestUser(
            String email,
            String firstName,
            String lastName,
            OrderRequestDTO orderRequest
    ) {
        log.info(
                "Creando usuario invitado: {}",
                email
        );

        User guestUser = User.builder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .phone(orderRequest.getPayer().getPhone())
                .status(UserStatus.INVITADO)
                .build();

        return userRepository.save(guestUser);
    }

    private String normalizeName(
            String name
    ) {
        if (name == null || name.isBlank()) {
            return "Invitado";
        }

        return name.trim().replaceAll("\\s+", " ");
    }

    private String[] separateName(
            String fullName
    ) {
        int firstSpaceIndex = fullName.indexOf(" ");

        if (firstSpaceIndex < 0) {
            return new String[]{
                    fullName,
                    ""
            };
        }

        String firstName = fullName
                .substring(0, firstSpaceIndex)
                .trim();

        String lastName = fullName
                .substring(firstSpaceIndex + 1)
                .trim();

        return new String[]{
                firstName,
                lastName
        };
    }

    private String firstNonBlank(
            String firstValue,
            String secondValue
    ) {
        if (
                firstValue != null
                        && !firstValue.isBlank()
        ) {
            return firstValue.trim();
        }

        if (
                secondValue != null
                        && !secondValue.isBlank()
        ) {
            return secondValue.trim();
        }

        return null;
    }

    private String removeTrailingSlash(
            String url
    ) {
        if (url == null || url.isBlank()) {
            throw new IllegalStateException(
                    "La propiedad app.frontend-url no está configurada."
            );
        }

        return url.trim().replaceAll("/+$", "");
    }
}