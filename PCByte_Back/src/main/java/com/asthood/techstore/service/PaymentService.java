package com.asthood.techstore.service;

import com.asthood.techstore.model.Order;
import com.asthood.techstore.model.OrderItem;
import com.asthood.techstore.model.OrderStatus;
import com.asthood.techstore.repository.OrderRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private static final String CURRENCY_ID = "CLP";
    private static final String SHIPPING_ITEM_ID = "SHIPPING";

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @Value("${mercadopago.access.token}")
    private String accessToken;

    @Value("${app.base-url}")
    private String backendUrl;

    // =========================================================
    // CREAR PREFERENCIA DE PAGO
    // =========================================================

    @Transactional(readOnly = true)
    public String createPreference(Long orderId) {
        try {
            validateOrderId(orderId);

            /*
             * La orden se obtiene desde la base de datos.
             *
             * El frontend ya no determina:
             *
             * - nombres de productos
             * - precios
             * - subtotal
             * - costo de despacho
             * - total final
             */
            Order order = orderRepository
                    .findById(orderId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "La orden #" + orderId + " no existe."
                            )
                    );

            validateOrderForPayment(order);

            MercadoPagoConfig.setAccessToken(accessToken);

            List<PreferenceItemRequest> mercadoPagoItems =
                    buildPreferenceItems(order);

            validatePreferenceTotal(
                    order,
                    mercadoPagoItems
            );

            PreferenceBackUrlsRequest backUrls =
                    buildBackUrls();

            PreferenceRequest preferenceRequest =
                    PreferenceRequest.builder()
                            .items(mercadoPagoItems)
                            .backUrls(backUrls)
                            .autoReturn("approved")
                            .notificationUrl(
                                    backendUrl
                                            + "/api/payments/webhook"
                            )
                            .externalReference(
                                    order.getId().toString()
                            )
                            .binaryMode(true)
                            .build();

            PreferenceClient preferenceClient =
                    new PreferenceClient();

            Preference preference =
                    preferenceClient.create(
                            preferenceRequest
                    );

            if (
                    preference == null
                            || preference.getInitPoint() == null
                            || preference.getInitPoint().isBlank()
            ) {
                throw new IllegalStateException(
                        "Mercado Pago no devolvió una URL de checkout válida."
                );
            }

            log.info(
                    "Preferencia de Mercado Pago creada para la orden #{}. "
                            + "Subtotal: {}, despacho: {}, total: {}.",
                    order.getId(),
                    order.getSubtotal(),
                    order.getShippingCost(),
                    order.getTotal()
            );

            return preference.getInitPoint();

        } catch (MPApiException exception) {
            logMercadoPagoApiException(
                    exception
            );

            throw new IllegalStateException(
                    "Mercado Pago rechazó la creación de la preferencia.",
                    exception
            );

        } catch (IllegalArgumentException | IllegalStateException exception) {
            log.warn(
                    "No se pudo crear la preferencia de pago para la orden #{}: {}",
                    orderId,
                    exception.getMessage()
            );

            throw exception;

        } catch (Exception exception) {
            log.error(
                    "Error general al crear la preferencia para la orden #{}.",
                    orderId,
                    exception
            );

            throw new IllegalStateException(
                    "No se pudo crear la preferencia de pago.",
                    exception
            );
        }
    }

    // =========================================================
    // CONSTRUIR PRODUCTOS PARA MERCADO PAGO
    // =========================================================

    private List<PreferenceItemRequest> buildPreferenceItems(
            Order order
    ) {
        List<PreferenceItemRequest> mercadoPagoItems =
                new ArrayList<>();

        for (OrderItem orderItem : order.getOrderItems()) {
            validateOrderItem(
                    orderItem
            );

            PreferenceItemRequest productItem =
                    PreferenceItemRequest.builder()
                            .id(
                                    orderItem
                                            .getProduct()
                                            .getId()
                                            .toString()
                            )
                            .title(
                                    normalizeProductTitle(
                                            orderItem
                                                    .getProduct()
                                                    .getName(),
                                            orderItem
                                                    .getProduct()
                                                    .getId()
                                    )
                            )
                            .quantity(
                                    orderItem.getQuantity()
                            )
                            .unitPrice(
                                    orderItem.getPrice()
                            )
                            .currencyId(
                                    CURRENCY_ID
                            )
                            .build();

            mercadoPagoItems.add(
                    productItem
            );
        }

        /*
         * El despacho se agrega como un producto separado solamente
         * cuando tiene un costo superior a cero.
         *
         * Si el despacho es gratuito, el total de Mercado Pago queda
         * compuesto únicamente por los productos.
         */
        if (
                order.getShippingCost() != null
                        && order.getShippingCost()
                        .compareTo(BigDecimal.ZERO) > 0
        ) {
            PreferenceItemRequest shippingItem =
                    PreferenceItemRequest.builder()
                            .id(
                                    SHIPPING_ITEM_ID
                            )
                            .title(
                                    buildShippingTitle(order)
                            )
                            .quantity(1)
                            .unitPrice(
                                    order.getShippingCost()
                            )
                            .currencyId(
                                    CURRENCY_ID
                            )
                            .build();

            mercadoPagoItems.add(
                    shippingItem
            );
        }

        if (mercadoPagoItems.isEmpty()) {
            throw new IllegalStateException(
                    "La orden no contiene productos para pagar."
            );
        }

        return mercadoPagoItems;
    }

    private String buildShippingTitle(
            Order order
    ) {
        String label =
                normalizeOptional(
                        order.getShippingLabel()
                );

        String carrier =
                normalizeOptional(
                        order.getShippingCarrier()
                );

        if (label != null && carrier != null) {
            return "Despacho - "
                    + label
                    + " ("
                    + carrier
                    + ")";
        }

        if (label != null) {
            return "Despacho - "
                    + label;
        }

        if (carrier != null) {
            return "Despacho - "
                    + carrier;
        }

        return "Despacho";
    }

    private String normalizeProductTitle(
            String productName,
            Long productId
    ) {
        String normalizedName =
                normalizeOptional(
                        productName
                );

        if (normalizedName != null) {
            return normalizedName;
        }

        return "Producto #" + productId;
    }

    // =========================================================
    // VALIDACIÓN DE TOTALES
    // =========================================================

    private void validatePreferenceTotal(
            Order order,
            List<PreferenceItemRequest> mercadoPagoItems
    ) {
        BigDecimal preferenceTotal =
                mercadoPagoItems
                        .stream()
                        .map(item ->
                                item.getUnitPrice()
                                        .multiply(
                                                BigDecimal.valueOf(
                                                        item.getQuantity()
                                                )
                                        )
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        if (
                preferenceTotal.compareTo(
                        order.getTotal()
                ) != 0
        ) {
            throw new IllegalStateException(
                    "El total calculado para Mercado Pago no coincide "
                            + "con el total almacenado en la orden. "
                            + "Orden: "
                            + order.getTotal()
                            + ", preferencia: "
                            + preferenceTotal
                            + "."
            );
        }
    }

    // =========================================================
    // URLS DE RETORNO
    // =========================================================

    private PreferenceBackUrlsRequest buildBackUrls() {
        return PreferenceBackUrlsRequest.builder()
                .success(
                        backendUrl
                                + "/api/payments/success"
                )
                .failure(
                        backendUrl
                                + "/api/payments/failure"
                )
                .pending(
                        backendUrl
                                + "/api/payments/pending"
                )
                .build();
    }

    // =========================================================
    // VALIDACIONES DE LA ORDEN
    // =========================================================

    private void validateOrderId(
            Long orderId
    ) {
        if (orderId == null) {
            throw new IllegalArgumentException(
                    "El ID de la orden es obligatorio."
            );
        }

        if (orderId <= 0) {
            throw new IllegalArgumentException(
                    "El ID de la orden no es válido."
            );
        }
    }

    private void validateOrderForPayment(
            Order order
    ) {
        if (order.getStatus() != OrderStatus.PENDIENTE) {
            throw new IllegalStateException(
                    "La orden #"
                            + order.getId()
                            + " no está pendiente de pago."
            );
        }

        if (
                order.getOrderItems() == null
                        || order.getOrderItems().isEmpty()
        ) {
            throw new IllegalStateException(
                    "La orden #"
                            + order.getId()
                            + " no contiene productos."
            );
        }

        if (
                order.getSubtotal() == null
                        || order.getSubtotal()
                        .compareTo(BigDecimal.ZERO) <= 0
        ) {
            throw new IllegalStateException(
                    "La orden no tiene un subtotal válido."
            );
        }

        if (order.getShippingCost() == null) {
            throw new IllegalStateException(
                    "La orden no tiene un costo de despacho válido."
            );
        }

        if (
                order.getShippingCost()
                        .compareTo(BigDecimal.ZERO) < 0
        ) {
            throw new IllegalStateException(
                    "El costo de despacho no puede ser negativo."
            );
        }

        if (
                order.getTotal() == null
                        || order.getTotal()
                        .compareTo(BigDecimal.ZERO) <= 0
        ) {
            throw new IllegalStateException(
                    "La orden no tiene un total válido."
            );
        }

        BigDecimal expectedTotal =
                order.getSubtotal()
                        .add(
                                order.getShippingCost()
                        );

        if (
                expectedTotal.compareTo(
                        order.getTotal()
                ) != 0
        ) {
            throw new IllegalStateException(
                    "El total de la orden no coincide con "
                            + "el subtotal más el despacho."
            );
        }
    }

    private void validateOrderItem(
            OrderItem orderItem
    ) {
        if (orderItem == null) {
            throw new IllegalStateException(
                    "La orden contiene un producto inválido."
            );
        }

        if (
                orderItem.getProduct() == null
                        || orderItem.getProduct().getId() == null
        ) {
            throw new IllegalStateException(
                    "Un producto de la orden no contiene una referencia válida."
            );
        }

        if (
                orderItem.getQuantity() == null
                        || orderItem.getQuantity() <= 0
        ) {
            throw new IllegalStateException(
                    "Un producto de la orden contiene una cantidad inválida."
            );
        }

        if (
                orderItem.getPrice() == null
                        || orderItem.getPrice()
                        .compareTo(BigDecimal.ZERO) <= 0
        ) {
            throw new IllegalStateException(
                    "Un producto de la orden contiene un precio inválido."
            );
        }
    }

    // =========================================================
    // PROCESAR WEBHOOK
    // =========================================================

    public void processWebhook(
            String topic,
            String paymentId
    ) {
        if (
                paymentId == null
                        || paymentId.isBlank()
        ) {
            log.debug(
                    "Webhook ignorado porque no contiene paymentId."
            );
            return;
        }

        if (
                topic == null
                        || !"payment".equalsIgnoreCase(topic)
        ) {
            log.debug(
                    "Webhook ignorado porque el topic no corresponde a payment."
            );
            return;
        }

        try {
            MercadoPagoConfig.setAccessToken(
                    accessToken
            );

            PaymentClient paymentClient =
                    new PaymentClient();

            Payment payment =
                    paymentClient.get(
                            Long.parseLong(
                                    paymentId
                            )
                    );

            if (payment == null) {
                log.warn(
                        "Mercado Pago no devolvió información para el pago {}.",
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
                        "Pago {} recibido con estado {}. "
                                + "No se confirmará la orden.",
                        paymentId,
                        payment.getStatus()
                );

                return;
            }

            String externalReference =
                    payment.getExternalReference();

            if (
                    externalReference == null
                            || externalReference.isBlank()
            ) {
                throw new IllegalStateException(
                        "El pago no contiene external_reference."
                );
            }

            Long orderId =
                    Long.parseLong(
                            externalReference
                    );

            boolean processed =
                    orderService.confirmPayment(
                            orderId,
                            paymentId
                    );

            if (processed) {
                log.info(
                        "Pago {} procesado correctamente para la orden #{}.",
                        paymentId,
                        orderId
                );
            } else {
                log.info(
                        "La orden #{} ya había sido procesada anteriormente.",
                        orderId
                );
            }

        } catch (MPApiException exception) {
            logMercadoPagoApiException(
                    exception
            );

            throw new IllegalStateException(
                    "Mercado Pago rechazó la consulta del pago.",
                    exception
            );

        } catch (NumberFormatException exception) {
            log.error(
                    "El paymentId o external_reference no tiene un formato numérico válido. "
                            + "Payment ID: {}.",
                    paymentId,
                    exception
            );

            throw new IllegalStateException(
                    "El webhook contiene identificadores inválidos.",
                    exception
            );

        } catch (Exception exception) {
            log.error(
                    "Error procesando webhook de Mercado Pago. Payment ID: {}.",
                    paymentId,
                    exception
            );

            throw new IllegalStateException(
                    "No se pudo procesar el webhook de Mercado Pago.",
                    exception
            );
        }
    }

    // =========================================================
    // UTILIDADES
    // =========================================================

    private String normalizeOptional(
            String value
    ) {
        if (
                value == null
                        || value.isBlank()
        ) {
            return null;
        }

        return value
                .trim()
                .replaceAll(
                        "\\s+",
                        " "
                );
    }

    private void logMercadoPagoApiException(
            MPApiException exception
    ) {
        if (exception.getApiResponse() == null) {
            log.error(
                    "Mercado Pago devolvió un error sin respuesta HTTP.",
                    exception
            );

            return;
        }

        log.error(
                "Error HTTP de Mercado Pago: {}.",
                exception
                        .getApiResponse()
                        .getStatusCode()
        );

        log.error(
                "Respuesta de Mercado Pago: {}.",
                exception
                        .getApiResponse()
                        .getContent()
        );
    }
}