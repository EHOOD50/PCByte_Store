package com.asthood.techstore.service;

import com.asthood.techstore.dto.CartItemDTO;
import com.asthood.techstore.model.Order;
import com.asthood.techstore.model.OrderItem;
import com.asthood.techstore.model.OrderStatus;
import com.asthood.techstore.model.User;
import com.asthood.techstore.repository.OrderRepository;
import com.asthood.techstore.repository.ProductRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @Value("${mercadopago.access.token}")
    private String accessToken;

    @Value("${app.base-url}")
    private String backendUrl;

    // --- 1. CREACIÓN DE LA PREFERENCIA ---
    public String createPreference(User user, List<CartItemDTO> items, Long orderId) {
        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            // Preparar items para Mercado Pago
            List<PreferenceItemRequest> mpItems = new ArrayList<>();
            for (CartItemDTO item : items) {
                PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                        .id(item.getProductId().toString())
                        .title("Producto TechStore")
                        .quantity(item.getQuantity())
                        .unitPrice(item.getPrice())
                        .currencyId("CLP")
                        .build();
                mpItems.add(itemRequest);
            }

            // Configuración de URLs (Usando tu Ngrok actual)
            String NGROK_URL = "https://unrarefied-unpervasive-pandora.ngrok-free.dev";

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(NGROK_URL + "/api/payments/success")
                    .failure(NGROK_URL + "/")
                    .pending(NGROK_URL + "/success")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(mpItems)
                    .backUrls(backUrls)
                    .autoReturn("approved")
                    .notificationUrl(NGROK_URL + "/api/payments/webhook")
                    .externalReference(orderId.toString()) // VINCULACIÓN CON LA ORDEN DEL CONTROLLER
                    .binaryMode(true)
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return preference.getInitPoint();

        } catch (Exception e) {
            throw new RuntimeException("Error al crear preferencia: " + e.getMessage());
        }
    }

    // --- 2. PROCESAMIENTO DEL WEBHOOK (CONFIRMACIÓN REAL) ---
    public void processWebhook(String topic, String id) {
        try {
            if (id == null || id.trim().isEmpty()) return;

            if ("payment".equals(topic)) {
                MercadoPagoConfig.setAccessToken(accessToken);
                PaymentClient client = new PaymentClient();
                Payment payment = client.get(Long.parseLong(id));

                if (payment != null && "approved".equals(payment.getStatus())) {
                    String externalReference = payment.getExternalReference();

                    if (externalReference != null) {
                        Long orderId = Long.parseLong(externalReference);
                        Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

                        // Evitar procesar dos veces
                        if (order.getStatus() == OrderStatus.PAGADO) return;

                        // 1. Actualizar estado vía OrderService
                        orderService.markOrderAsPaid(orderId, id);

                        // 2. Lógica de Descuento de Stock (Si no está en markOrderAsPaid)
                        if (order.getOrderItems() != null) {
                            order.getOrderItems().forEach(orderItem -> {
                                productRepository.findById(orderItem.getProduct().getId())
                                        .ifPresent(product -> {
                                            int newStock = product.getStock() - orderItem.getQuantity();
                                            product.setStock(Math.max(newStock, 0));
                                            productRepository.save(product);
                                        });
                            });
                        }
                        System.out.println("✅ Pago procesado para Orden #" + orderId);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Error en Webhook: " + e.getMessage());
        }
    }
}