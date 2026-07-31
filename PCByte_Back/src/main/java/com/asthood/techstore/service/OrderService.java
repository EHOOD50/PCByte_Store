package com.asthood.techstore.service;

import com.asthood.techstore.dto.OrderItemDTO;
import com.asthood.techstore.dto.OrderResponseDTO;
import com.asthood.techstore.dto.ProductSummaryDTO;
import com.asthood.techstore.model.Order;
import com.asthood.techstore.model.OrderItem;
import com.asthood.techstore.model.OrderStatus;
import com.asthood.techstore.repository.OrderRepository;
import com.asthood.techstore.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // =========================================================
    // LISTAR TODAS LAS ÓRDENES
    // =========================================================

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getAllOrders() {
        log.info(
                "Recuperando todas las órdenes"
        );

        return orderRepository
                .findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================================================
    // LISTAR ÓRDENES DEL CLIENTE
    // =========================================================

    /*
     * Recupera las órdenes asociadas a un usuario,
     * mostrando primero las compras más recientes.
     */
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getOrdersByUser(
            Long userId
    ) {
        validateUserId(
                userId
        );

        log.info(
                "Recuperando órdenes del usuario #{}",
                userId
        );

        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(
                        userId
                )
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================================================
    // OBTENER UNA ORDEN SEGURA POR ID
    // =========================================================

    /*
     * Devuelve una orden transformada a DTO.
     *
     * Nunca expone directamente:
     *
     * - User
     * - password
     * - direcciones actuales del usuario
     * - entidades JPA completas
     */
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(
            Long orderId
    ) {
        validateOrderId(
                orderId
        );

        log.info(
                "Recuperando resumen seguro de la orden #{}",
                orderId
        );

        Order order =
                orderRepository
                        .findById(
                                orderId
                        )
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Orden no encontrada con ID: "
                                                        + orderId
                                        )
                        );

        return convertToDTO(
                order
        );
    }

    // =========================================================
    // OBTENER ÚLTIMA ORDEN DEL CLIENTE
    // =========================================================

    /*
     * Devuelve la última orden del usuario utilizando
     * el mismo DTO seguro.
     */
    @Transactional(readOnly = true)
    public OrderResponseDTO getLatestOrderByUserId(
            Long userId
    ) {
        validateUserId(
                userId
        );

        log.info(
                "Recuperando última orden del usuario #{}",
                userId
        );

        Order order =
                orderRepository
                        .findFirstByUserIdOrderByIdDesc(
                                userId
                        )
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "No se encontraron órdenes para el usuario con ID: "
                                                        + userId
                                        )
                        );

        return convertToDTO(
                order
        );
    }

    // =========================================================
    // ACTUALIZAR ESTADO MANUAL
    // =========================================================

    @Transactional
    public OrderResponseDTO updateOrderStatus(
            Long id,
            OrderStatus newStatus
    ) {
        validateOrderId(
                id
        );

        if (newStatus == null) {
            throw new IllegalArgumentException(
                    "El nuevo estado de la orden es obligatorio."
            );
        }

        Order order =
                orderRepository
                        .findById(
                                id
                        )
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Orden no encontrada con ID: "
                                                        + id
                                        )
                        );

        order.setStatus(
                newStatus
        );

        Order updatedOrder =
                orderRepository.save(
                        order
                );

        log.info(
                "Estado de la orden #{} actualizado a {}.",
                id,
                newStatus
        );

        return convertToDTO(
                updatedOrder
        );
    }

    // =========================================================
    // CANCELAR ORDEN PENDIENTE
    // =========================================================

    /*
     * Cancela una orden sin eliminarla de la base de datos.
     *
     * Solamente puede cancelarse cuando:
     *
     * - existe;
     * - está en estado PENDIENTE;
     * - no tiene un pago de Mercado Pago asociado.
     */
    @Transactional
    public OrderResponseDTO cancelOrder(
            Long orderId
    ) {
        validateOrderId(
                orderId
        );

        /*
         * Se bloquea la orden durante la operación para impedir
         * que una cancelación y una confirmación de pago sean
         * procesadas simultáneamente.
         */
        Order order =
                orderRepository
                        .findByIdForUpdate(
                                orderId
                        )
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Orden no encontrada con ID: "
                                                        + orderId
                                        )
                        );

        if (
                order.getStatus() ==
                        OrderStatus.CANCELADO
        ) {
            throw new IllegalStateException(
                    "La orden #"
                            + orderId
                            + " ya se encuentra cancelada."
            );
        }

        if (
                order.getStatus() !=
                        OrderStatus.PENDIENTE
        ) {
            throw new IllegalStateException(
                    "Solo es posible cancelar órdenes pendientes."
            );
        }

        if (
                order.getPaymentId() != null &&
                        !order.getPaymentId()
                                .isBlank()
        ) {
            throw new IllegalStateException(
                    "La orden ya posee un pago asociado y no puede cancelarse."
            );
        }

        order.setStatus(
                OrderStatus.CANCELADO
        );

        Order cancelledOrder =
                orderRepository.save(
                        order
                );

        log.info(
                "Orden #{} cancelada correctamente.",
                orderId
        );

        return convertToDTO(
                cancelledOrder
        );
    }

    // =========================================================
    // CONFIRMAR PAGO
    // =========================================================

    /*
     * Confirma una compra en una única transacción.
     *
     * Flujo:
     *
     * 1. Bloquea la orden.
     * 2. Evita procesarla más de una vez.
     * 3. Verifica que el paymentId no pertenezca a otra orden.
     * 4. Valida productos y cantidades.
     * 5. Descuenta stock de forma atómica.
     * 6. Guarda el paymentId.
     * 7. Cambia el estado a PAGADO.
     *
     * Si cualquier paso falla, toda la operación se revierte.
     *
     * @return true si la orden fue procesada en esta llamada;
     * false si ya estaba pagada.
     */
    @Transactional
    public boolean confirmPayment(
            Long orderId,
            String mpPaymentId
    ) {
        validatePaymentData(
                orderId,
                mpPaymentId
        );

        Order order =
                orderRepository
                        .findByIdForUpdate(
                                orderId
                        )
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Orden no encontrada con ID: "
                                                        + orderId
                                        )
                        );

        /*
         * Esta comprobación ocurre después de bloquear
         * la orden.
         *
         * Así evitamos que el retorno y el webhook
         * descuenten stock simultáneamente.
         */
        if (
                order.getStatus() ==
                        OrderStatus.PAGADO
        ) {
            log.info(
                    "La orden #{} ya estaba pagada. No se procesará nuevamente.",
                    orderId
            );

            return false;
        }

        /*
         * Una orden cancelada no puede ser confirmada aunque
         * llegue posteriormente un webhook de una preferencia
         * generada antes de la cancelación.
         */
        if (
                order.getStatus() ==
                        OrderStatus.CANCELADO
        ) {
            throw new IllegalStateException(
                    "La orden #"
                            + orderId
                            + " está cancelada y no puede confirmarse."
            );
        }

        if (
                order.getStatus() !=
                        OrderStatus.PENDIENTE
        ) {
            throw new IllegalStateException(
                    "La orden #"
                            + orderId
                            + " no está pendiente de pago."
            );
        }

        validatePaymentIdIsAvailable(
                orderId,
                mpPaymentId
        );

        List<OrderItem> orderItems =
                order.getOrderItems();

        if (
                orderItems == null ||
                        orderItems.isEmpty()
        ) {
            throw new IllegalStateException(
                    "La orden #"
                            + orderId
                            + " no contiene productos."
            );
        }

        for (
                OrderItem item :
                orderItems
        ) {
            validateOrderItem(
                    orderId,
                    item
            );

            Long productId =
                    item.getProduct()
                            .getId();

            Integer quantity =
                    item.getQuantity();

            /*
             * decreaseStock devuelve:
             *
             * 1 = stock descontado correctamente.
             * 0 = producto inexistente o stock insuficiente.
             */
            int affectedRows =
                    productRepository
                            .decreaseStock(
                                    productId,
                                    quantity
                            );

            if (affectedRows == 0) {
                throw new IllegalStateException(
                        "Stock insuficiente para el producto \""
                                + item.getProduct()
                                .getName()
                                + "\"."
                );
            }
        }

        order.setPaymentId(
                mpPaymentId.trim()
        );

        order.setStatus(
                OrderStatus.PAGADO
        );

        orderRepository.save(
                order
        );

        log.info(
                "Orden #{} confirmada con pago {}. Stock actualizado correctamente.",
                orderId,
                mpPaymentId
        );

        return true;
    }

    // =========================================================
    // VALIDACIONES
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
                    "El ID de la orden debe ser mayor que cero."
            );
        }
    }

    private void validateUserId(
            Long userId
    ) {
        if (userId == null) {
            throw new IllegalArgumentException(
                    "El ID del usuario es obligatorio."
            );
        }

        if (userId <= 0) {
            throw new IllegalArgumentException(
                    "El ID del usuario debe ser mayor que cero."
            );
        }
    }

    private void validatePaymentData(
            Long orderId,
            String mpPaymentId
    ) {
        validateOrderId(
                orderId
        );

        if (
                mpPaymentId == null ||
                        mpPaymentId.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El ID del pago de Mercado Pago es obligatorio."
            );
        }
    }

    private void validatePaymentIdIsAvailable(
            Long orderId,
            String mpPaymentId
    ) {
        orderRepository
                .findByPaymentId(
                        mpPaymentId.trim()
                )
                .ifPresent(
                        existingOrder -> {
                            if (
                                    !existingOrder
                                            .getId()
                                            .equals(
                                                    orderId
                                            )
                            ) {
                                throw new IllegalStateException(
                                        "El pago "
                                                + mpPaymentId
                                                + " ya está asociado a otra orden."
                                );
                            }
                        }
                );
    }

    private void validateOrderItem(
            Long orderId,
            OrderItem item
    ) {
        if (item == null) {
            throw new IllegalStateException(
                    "La orden #"
                            + orderId
                            + " contiene un ítem inválido."
            );
        }

        if (
                item.getProduct() == null ||
                        item.getProduct()
                                .getId() == null
        ) {
            throw new IllegalStateException(
                    "La orden #"
                            + orderId
                            + " contiene un producto inexistente."
            );
        }

        if (
                item.getQuantity() == null ||
                        item.getQuantity() <= 0
        ) {
            throw new IllegalStateException(
                    "Cantidad inválida para el producto \""
                            + item.getProduct()
                            .getName()
                            + "\"."
            );
        }

        if (
                item.getPrice() == null ||
                        item.getPrice()
                                .signum() < 0
        ) {
            throw new IllegalStateException(
                    "Precio inválido para el producto \""
                            + item.getProduct()
                            .getName()
                            + "\"."
            );
        }
    }

    // =========================================================
    // CONVERSIÓN SEGURA A DTO
    // =========================================================

    private OrderResponseDTO convertToDTO(
            Order order
    ) {
        String customerName =
                "Cliente desconocido";

        if (
                order.getFullName() != null &&
                        !order.getFullName()
                                .isBlank()
        ) {
            customerName =
                    order.getFullName()
                            .trim();

        } else if (
                order.getUser() != null &&
                        order.getUser()
                                .getFirstName() != null &&
                        !order.getUser()
                                .getFirstName()
                                .isBlank()
        ) {
            customerName =
                    order.getUser()
                            .getFirstName()
                            .trim();
        }

        List<OrderItemDTO> itemDTOs =
                order.getOrderItems() == null
                        ? List.of()
                        : order.getOrderItems()
                        .stream()
                        .map(
                                item ->
                                        new OrderItemDTO(
                                                item.getProduct()
                                                        .getId(),
                                                item.getProduct()
                                                        .getName(),
                                                item.getQuantity(),
                                                item.getPrice(),
                                                new ProductSummaryDTO(
                                                        item.getProduct()
                                                                .getId(),
                                                        item.getProduct()
                                                                .getName(),
                                                        item.getProduct()
                                                                .getImageUrl()
                                                )
                                        )
                        )
                        .toList();

        return new OrderResponseDTO(
                order.getId(),
                customerName,
                order.getEmail(),
                order.getPhone(),

                order.getSubtotal(),
                order.getShippingCost(),
                order.getTotal(),

                order.getStatus().name(),
                order.getCreatedAt(),
                order.getPaymentId(),

                order.getStreet(),
                order.getNumber(),
                order.getApartment(),
                order.getCity(),
                order.getRegion(),
                order.getExtraInfo(),

                order.getShippingRateId(),
                order.getShippingType(),
                order.getShippingLabel(),
                order.getShippingCarrier(),
                order.getShippingFree(),
                order.getEstimatedMinDays(),
                order.getEstimatedMaxDays(),

                itemDTOs
        );
    }
}