package com.asthood.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingRateDTO {

    private Long id;

    private String name;

    private String region;

    private String city;

    private String shippingType;

    private String carrier;

    private BigDecimal price;

    private BigDecimal freeShippingFrom;

    private Integer estimatedMinDays;

    private Integer estimatedMaxDays;

    private Boolean active;

    private Integer priority;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}