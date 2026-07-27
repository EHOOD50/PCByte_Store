package com.asthood.techstore.dto;

import java.math.BigDecimal;

public record OrderItemDTO(
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal price,
        ProductSummaryDTO product
) {}