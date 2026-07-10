package com.asthood.techstore.dto;

import java.math.BigDecimal;

public record OrderItemDTO(
        Long productId,
        String productName, // <--- Verifica que se llame así
        Integer quantity,
        BigDecimal price
) {}