package com.asthood.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingQuoteDTO {

    private Long shippingRateId;

    private String shippingType;

    private String label;

    private String carrier;

    private BigDecimal originalPrice;

    private BigDecimal cost;

    private Boolean freeShipping;

    private BigDecimal freeShippingFrom;

    private Integer estimatedMinDays;

    private Integer estimatedMaxDays;

    private Boolean available;

    private String message;
}