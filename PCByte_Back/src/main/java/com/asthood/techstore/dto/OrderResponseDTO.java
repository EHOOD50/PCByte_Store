package com.asthood.techstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(

        Long id,

        // --- Datos del cliente ---
        String fullName,          // Nombre del receptor (Snapshot)
        String email,             // Email usado en la compra
        String phone,             // Teléfono de contacto (Snapshot)

        // --- Resumen financiero ---
        BigDecimal subtotal,      // Total de productos sin despacho
        BigDecimal shippingCost,  // Costo del despacho
        BigDecimal total,         // Subtotal + despacho

        // --- Estado y pago ---
        String status,            // Valor del Enum OrderStatus
        LocalDateTime createdAt,
        String paymentId,         // ID de Mercado Pago

        // --- Snapshot de dirección ---
        String street,            // Calle
        String number,            // Número / altura
        String apartment,         // Depto / block / oficina
        String city,
        String region,
        String extraInfo,         // Referencias adicionales

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