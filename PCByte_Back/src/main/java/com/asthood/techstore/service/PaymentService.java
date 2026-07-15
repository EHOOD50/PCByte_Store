package com.asthood.techstore.service;

import com.asthood.techstore.dto.CartItemDTO;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final OrderService orderService;

    @Value("${mercadopago.access.token}")
    private String accessToken;

    @Value("${app.base-url}")
    private String backendUrl;

    // ============================
    // CREAR PREFERENCIA DE PAGO
    // ============================

    public String createPreference(
            List<CartItemDTO> items,
            Long orderId
    ) {
        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            List<PreferenceItemRequest> mpItems =
                    new ArrayList<>();

            for (CartItemDTO item : items) {
                PreferenceItemRequest itemRequest =
                        PreferenceItemRequest.builder()
                                .id(item.getProductId().toString())
                                .title(item.getName())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getPrice())
                                .currencyId("CLP")
                                .build();

                mpItems.add(itemRequest);
            }

            PreferenceBackUrlsRequest backUrls =
                    PreferenceBackUrlsRequest.builder()
                            .success(
                                    backendUrl +
                                            "/api/payments/success"
                            )
                            .failure(
                                    backendUrl +
                                            "/api/payments/failure"
                            )
                            .pending(
                                    backendUrl +
                                            "/api/payments/pending"
                            )
                            .build();

            PreferenceRequest preferenceRequest =
                    PreferenceRequest.builder()
                            .items(mpItems)
                            .backUrls(backUrls)
                            .autoReturn("approved")
                            .notificationUrl(
                                    backendUrl +
                                            "/api/payments/webhook"
                            )
                            .externalReference(
                                    orderId.toString()
                            )
                            .binaryMode(true)
                            .build();

            PreferenceClient client =
                    new PreferenceClient();

            Preference preference =
                    client.create(preferenceRequest);

            return preference.getInitPoint();

        } catch (Exception exception) {
            log.error(
                    "Error al crear la preferencia de Mercado Pago",
                    exception
            );

            throw new IllegalStateException(
                    "No se pudo crear la preferencia de pago.",
                    exception
            );
        }
    }

    // ============================
    // PROCESAR WEBHOOK
    // ============================

    public void processWebhook(
            String topic,
            String paymentId
    ) {
        if (
                paymentId == null ||
                        paymentId.isBlank()
        ) {
            return;
        }

        if (
                topic == null ||
                        !"payment".equalsIgnoreCase(topic)
        ) {
            return;
        }

        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            PaymentClient paymentClient =
                    new PaymentClient();

            Payment payment =
                    paymentClient.get(
                            Long.parseLong(paymentId)
                    );

            if (payment == null) {
                log.warn(
                        "Mercado Pago no devolvió información para el pago {}",
                        paymentId
                );
                return;
            }

            if (
                    !"approved".equalsIgnoreCase(
                            payment.getStatus()
                    )
            ) {
                log.info(
                        "Pago {} recibido con estado {}. No se confirmará la orden.",
                        paymentId,
                        payment.getStatus()
                );
                return;
            }

            String externalReference =
                    payment.getExternalReference();

            if (
                    externalReference == null ||
                            externalReference.isBlank()
            ) {
                throw new IllegalStateException(
                        "El pago no contiene external_reference."
                );
            }

            Long orderId =
                    Long.parseLong(externalReference);

            boolean processed =
                    orderService.confirmPayment(
                            orderId,
                            paymentId
                    );

            if (processed) {
                log.info(
                        "Pago {} procesado correctamente para la orden #{}",
                        paymentId,
                        orderId
                );
            } else {
                log.info(
                        "La orden #{} ya había sido procesada anteriormente.",
                        orderId
                );
            }

        } catch (Exception exception) {
            log.error(
                    "Error procesando webhook de Mercado Pago. Payment ID: {}",
                    paymentId,
                    exception
            );

            throw new IllegalStateException(
                    "No se pudo procesar el webhook de Mercado Pago.",
                    exception
            );
        }
    }
}