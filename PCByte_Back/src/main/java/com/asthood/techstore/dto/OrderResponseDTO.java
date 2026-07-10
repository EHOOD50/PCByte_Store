package com.asthood.techstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(
        Long id,
        String fullName,      // Nombre del receptor (Snapshot)
        String email,         // Email usado en la compra
        String phone,         // Teléfono de contacto (Snapshot)
        BigDecimal total,
        String status,        // El String del Enum OrderStatus
        LocalDateTime createdAt,
        String paymentId,     // ID de Mercado Pago

        // --- Snapshot de Dirección Desglosado ---
        String street,        // Calle
        String number,        // Número/Altura
        String apartment,     // Depto/Block/Oficina
        String city,
        String region,
        String extraInfo,     // Referencias (ej: "Portón rojo")

        // --- Detalle de Productos ---
        List<OrderItemDTO> items
) {}