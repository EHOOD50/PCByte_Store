package com.asthood.techstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductCreateDTO {

    @Size(max = 100, message = "El SKU no puede superar 100 caracteres")
    private String sku;

    @Size(max = 100, message = "El MPN no puede superar 100 caracteres")
    private String mpn;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 255, message = "El nombre no puede superar 255 caracteres")
    private String name;

    private String description;

    private String specifications;

    private String warranty;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    private BigDecimal price;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private Boolean active;

    @NotNull(message = "La categoría es obligatoria")
    private Long categoryId;

    private Long brandId;

    private String imageUrl;
}