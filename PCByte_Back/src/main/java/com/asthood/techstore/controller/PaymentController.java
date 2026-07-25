package com.asthood.techstore.controller;

import com.asthood.techstore.dto.OrderRequestDTO;
import com.asthood.techstore.dto.PaymentResponseDTO;
import com.asthood.techstore.model.Order;
import com.asthood.techstore.repository.OrderRepository;
import com.asthood.techstore.service.OrderCheckoutService;
import com.asthood.techstore.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderCheckoutService orderCheckoutService;
    private final OrderRepository orderRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    // =========================================================
    // CREAR O REUTILIZAR ORDEN Y CREAR PREFERENCIA
    // =========================================================

    @PostMapping("/create_preference")
    public ResponseEntity<PaymentResponseDTO> create(
            @RequestBody OrderRequestDTO orderRequest
    ) {
        try {
            Order preparedOrder =
                    orderCheckoutService.prepareOrder(
                            orderRequest
                    );

            String checkoutUrl =
                    paymentService.createPreference(
                            orderRequest.getItems(),
                            preparedOrder.getId()
                    );

            log.info(
                    "Preferencia creada para la orden #{} por un total de ${}",
                    preparedOrder.getId(),
                    preparedOrder.getTotal()
            );

            return ResponseEntity.ok(
                    new PaymentResponseDTO(
                            checkoutUrl,
                            preparedOrder.getId()
                    )
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
                    "Error crítico al preparar la orden o crear la preferencia de pago",
                    exception
            );

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }

    // =========================================================
    // RETORNO APROBADO DESDE MERCADO PAGO
    // =========================================================

    @GetMapping("/success")
    public RedirectView redirectAfterPaymentSuccess(
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
                .fromUriString(
                        removeTrailingSlash(
                                frontendUrl
                        )
                )
                .path("/success")
                .queryParam(
                        "payment_id",
                        valueOrEmpty(
                                paymentId
                        )
                )
                .queryParam(
                        "status",
                        valueOrEmpty(
                                status
                        )
                )
                .queryParam(
                        "external_reference",
                        valueOrEmpty(
                                externalReference
                        )
                )
                .build()
                .encode()
                .toUriString();

        log.info(
                "Pago aprobado. Redirigiendo hacia: {}",
                redirectUrl
        );

        return new RedirectView(
                redirectUrl
        );
    }

    // =========================================================
    // RETORNO FALLIDO O CANCELADO DESDE MERCADO PAGO
    // =========================================================

    @GetMapping("/failure")
    public RedirectView redirectAfterPaymentFailure(
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
                .fromUriString(
                        removeTrailingSlash(
                                frontendUrl
                        )
                )
                .path("/checkout")
                .queryParam(
                        "payment",
                        "failure"
                )
                .queryParam(
                        "payment_id",
                        valueOrEmpty(
                                paymentId
                        )
                )
                .queryParam(
                        "status",
                        valueOrEmpty(
                                status
                        )
                )
                .queryParam(
                        "external_reference",
                        valueOrEmpty(
                                externalReference
                        )
                )
                .build()
                .encode()
                .toUriString();

        log.info(
                "Pago cancelado o rechazado. Redirigiendo hacia: {}",
                redirectUrl
        );

        return new RedirectView(
                redirectUrl
        );
    }

    // =========================================================
    // RETORNO PENDIENTE DESDE MERCADO PAGO
    // =========================================================

    @GetMapping("/pending")
    public RedirectView redirectAfterPaymentPending(
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
                .fromUriString(
                        removeTrailingSlash(
                                frontendUrl
                        )
                )
                .path("/checkout")
                .queryParam(
                        "payment",
                        "pending"
                )
                .queryParam(
                        "payment_id",
                        valueOrEmpty(
                                paymentId
                        )
                )
                .queryParam(
                        "status",
                        valueOrEmpty(
                                status
                        )
                )
                .queryParam(
                        "external_reference",
                        valueOrEmpty(
                                externalReference
                        )
                )
                .build()
                .encode()
                .toUriString();

        log.info(
                "Pago pendiente. Redirigiendo hacia: {}",
                redirectUrl
        );

        return new RedirectView(
                redirectUrl
        );
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
        String paymentId =
                firstNonBlank(
                        id,
                        dataId
                );

        String finalTopic =
                firstNonBlank(
                        topic,
                        type
                );

        if (
                paymentId == null
                        || finalTopic == null
        ) {
            log.info(
                    "Webhook ignorado por no contener tipo o ID de pago"
            );

            return ResponseEntity
                    .ok()
                    .build();
        }

        if (
                !"payment".equalsIgnoreCase(
                        finalTopic
                )
        ) {
            log.info(
                    "Webhook ignorado. Tipo recibido: {}",
                    finalTopic
            );

            return ResponseEntity
                    .ok()
                    .build();
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

            return ResponseEntity
                    .ok()
                    .build();

        } catch (Exception exception) {
            log.error(
                    "Error procesando webhook de Mercado Pago. Payment ID: {}",
                    paymentId,
                    exception
            );

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
                .findFirstByUserIdOrderByIdDesc(
                        userId
                )
                .map(
                        ResponseEntity::ok
                )
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
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
                .map(
                        ResponseEntity::ok
                )
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
    // UTILIDADES
    // =========================================================

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

    private String valueOrEmpty(
            String value
    ) {
        return value == null
                ? ""
                : value.trim();
    }

    private String removeTrailingSlash(
            String url
    ) {
        if (
                url == null
                        || url.isBlank()
        ) {
            throw new IllegalStateException(
                    "La propiedad app.frontend-url no está configurada."
            );
        }

        return url
                .trim()
                .replaceAll(
                        "/+$",
                        ""
                );
    }
}