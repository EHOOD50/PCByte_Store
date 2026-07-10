package com.asthood.techstore.dto;

import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class ProductPatchDTO {

    @Positive(message = "El precio debe ser mayor a 0")
    private BigDecimal price;

    @Positive(message = "El stock debe ser mayor a 0")
    private Integer stock;

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
