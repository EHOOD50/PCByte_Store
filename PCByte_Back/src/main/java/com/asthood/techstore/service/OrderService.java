package com.asthood.techstore.service;

import com.asthood.techstore.dto.OrderItemDTO;
import com.asthood.techstore.dto.OrderResponseDTO;
import com.asthood.techstore.model.Order;
import com.asthood.techstore.model.OrderStatus;
import com.asthood.techstore.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getAllOrders() {
        log.info("📋 Recuperando todas las órdenes");
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponseDTO updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Orden no encontrada: " + id));

        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }

    @Transactional
    public void markOrderAsPaid(Long orderId, String mpPaymentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Orden no encontrada"));

        order.setStatus(OrderStatus.PAGADO);
        order.setPaymentId(mpPaymentId);

        orderRepository.save(order);
        log.info("✅ Orden #{} marcada como pagada", orderId);
    }

    // --- EL ÚNICO MÉTODO DE CONVERSIÓN QUE NECESITAS ---
    private OrderResponseDTO convertToDTO(Order order) {
        // Lógica de nombre del cliente para evitar nulos
        String customerName = "Cliente Desconocido";
        if (order.getFullName() != null && !order.getFullName().isBlank()) {
            customerName = order.getFullName();
        } else if (order.getUser() != null) {
            customerName = order.getUser().getFirstName();
        }

        // Mapeamos los items
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .collect(Collectors.toList());

        // Retornamos el Record siguiendo el orden exacto de tu nuevo OrderResponseDTO
        return new OrderResponseDTO(
                order.getId(),
                customerName,
                order.getEmail(),
                order.getPhone(),
                order.getTotal(),
                order.getStatus().name(),
                order.getCreatedAt(),
                order.getPaymentId(),
                order.getStreet(),       // Calle
                order.getNumber(),       // Número
                order.getApartment(),    // Depto/Block
                order.getCity(),
                order.getRegion(),
                order.getExtraInfo(),    // Info extra
                itemDTOs
        );
    }
}