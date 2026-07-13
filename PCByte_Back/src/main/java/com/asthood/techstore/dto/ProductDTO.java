package com.asthood.techstore.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDTO {

    private Long id;

    private String internalCode;

    private String sku;

    private String mpn;

    private String name;

    private String description;

    private String specifications;

    private String warranty;

    private BigDecimal price;

    private Integer stock;

    private Boolean active;

    private Long categoryId;

    private String categoryName;

    private Long brandId;

    private String brandName;

    private String imageUrl;
}