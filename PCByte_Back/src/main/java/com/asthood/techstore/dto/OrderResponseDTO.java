package com.asthood.techstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(

        Long id,

        // --- Datos del cliente ---
        String fullName,
        String email,
        String phone,
        String userStatus,

        // --- Resumen financiero ---
        BigDecimal subtotal,
        BigDecimal shippingCost,
        BigDecimal total,

        // --- Estado y pago ---
        String status,
        LocalDateTime createdAt,
        LocalDateTime paidAt,
        LocalDateTime preparingAt,
        LocalDateTime shippedAt,
        LocalDateTime deliveredAt,
        LocalDateTime cancelledAt,
        String paymentId,

        // --- Snapshot de dirección ---
        String street,
        String number,
        String apartment,
        String city,
        String region,
        String extraInfo,

        // --- Snapshot de despacho ---
        Long shippingRateId,
        String shippingType,
        String shippingLabel,
        String shippingCarrier,
        Boolean shippingFree,
        Integer estimatedMinDays,
        Integer estimatedMaxDays,

        // --- Detalle de productos ---
        List<OrderItemDTO> items

) {
}