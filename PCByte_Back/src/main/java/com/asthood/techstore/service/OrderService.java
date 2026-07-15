package com.asthood.techstore.service;

import com.asthood.techstore.dto.OrderItemDTO;
import com.asthood.techstore.dto.OrderResponseDTO;
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

    // ============================
    // LISTAR TODAS LAS ÓRDENES
    // ============================

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getAllOrders() {
        log.info("Recuperando todas las órdenes");

        return orderRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // ============================
    // ACTUALIZAR ESTADO MANUAL
    // ============================

    @Transactional
    public OrderResponseDTO updateOrderStatus(
            Long id,
            OrderStatus newStatus
    ) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Orden no encontrada con ID: " + id
                        )
                );

        order.setStatus(newStatus);

        Order updatedOrder =
                orderRepository.save(order);

        return convertToDTO(updatedOrder);
    }

    // ============================
    // CONFIRMAR PAGO
    // ============================

    /**
     * Confirma una compra en una sola transacción.
     *
     * Flujo:
     * 1. Bloquea la orden.
     * 2. Evita procesarla más de una vez.
     * 3. Verifica que el paymentId no pertenezca a otra orden.
     * 4. Valida los productos y cantidades.
     * 5. Descuenta stock de forma atómica.
     * 6. Guarda el paymentId.
     * 7. Marca la orden como PAGADO.
     *
     * Si cualquier paso falla, toda la operación se revierte.
     *
     * @return true si la orden fue procesada ahora;
     *         false si ya estaba pagada.
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

        Order order = orderRepository
                .findByIdForUpdate(orderId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Orden no encontrada con ID: " + orderId
                        )
                );

        /*
         * Esta comprobación ocurre después de bloquear la orden.
         * Así evitamos que dos webhooks descuenten stock a la vez.
         */
        if (order.getStatus() == OrderStatus.PAGADO) {
            log.info(
                    "La orden #{} ya estaba pagada. No se procesará nuevamente.",
                    orderId
            );

            return false;
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
                    "La orden #" + orderId +
                            " no contiene productos."
            );
        }

        for (OrderItem item : orderItems) {
            validateOrderItem(
                    orderId,
                    item
            );

            Long productId =
                    item.getProduct().getId();

            Integer quantity =
                    item.getQuantity();

            /*
             * decreaseStock devuelve:
             *
             * 1 = stock descontado correctamente.
             * 0 = producto inexistente o stock insuficiente.
             */
            int affectedRows =
                    productRepository.decreaseStock(
                            productId,
                            quantity
                    );

            if (affectedRows == 0) {
                throw new IllegalStateException(
                        "Stock insuficiente para el producto \"" +
                                item.getProduct().getName() +
                                "\"."
                );
            }
        }

        order.setPaymentId(mpPaymentId);
        order.setStatus(OrderStatus.PAGADO);

        orderRepository.save(order);

        log.info(
                "Orden #{} confirmada con pago {}. Stock actualizado correctamente.",
                orderId,
                mpPaymentId
        );

        return true;
    }

    // ============================
    // MÉTODOS AUXILIARES
    // ============================

    private void validatePaymentData(
            Long orderId,
            String mpPaymentId
    ) {
        if (orderId == null) {
            throw new IllegalArgumentException(
                    "El ID de la orden es obligatorio."
            );
        }

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
        orderRepository.findByPaymentId(mpPaymentId)
                .ifPresent(existingOrder -> {
                    if (
                            !existingOrder.getId()
                                    .equals(orderId)
                    ) {
                        throw new IllegalStateException(
                                "El pago " + mpPaymentId +
                                        " ya está asociado a otra orden."
                        );
                    }
                });
    }

    private void validateOrderItem(
            Long orderId,
            OrderItem item
    ) {
        if (item == null) {
            throw new IllegalStateException(
                    "La orden #" + orderId +
                            " contiene un ítem inválido."
            );
        }

        if (
                item.getProduct() == null ||
                        item.getProduct().getId() == null
        ) {
            throw new IllegalStateException(
                    "La orden #" + orderId +
                            " contiene un producto inexistente."
            );
        }

        if (
                item.getQuantity() == null ||
                        item.getQuantity() <= 0
        ) {
            throw new IllegalStateException(
                    "Cantidad inválida para el producto \"" +
                            item.getProduct().getName() +
                            "\"."
            );
        }
    }

    // ============================
    // CONVERSIÓN A DTO
    // ============================

    private OrderResponseDTO convertToDTO(
            Order order
    ) {
        String customerName =
                "Cliente Desconocido";

        if (
                order.getFullName() != null &&
                        !order.getFullName().isBlank()
        ) {
            customerName =
                    order.getFullName();
        } else if (
                order.getUser() != null &&
                        order.getUser().getFirstName() != null
        ) {
            customerName =
                    order.getUser().getFirstName();
        }

        List<OrderItemDTO> itemDTOs =
                order.getOrderItems() == null
                        ? List.of()
                        : order.getOrderItems()
                        .stream()
                        .map(item ->
                                new OrderItemDTO(
                                        item.getProduct().getId(),
                                        item.getProduct().getName(),
                                        item.getQuantity(),
                                        item.getPrice()
                                )
                        )
                        .toList();

        return new OrderResponseDTO(
                order.getId(),
                customerName,
                order.getEmail(),
                order.getPhone(),
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
                itemDTOs
        );
    }
}