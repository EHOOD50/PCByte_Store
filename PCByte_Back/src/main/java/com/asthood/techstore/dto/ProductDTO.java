package com.asthood.techstore.dto;

import com.asthood.techstore.domain.entity.Category;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Category category; // Aquí está el objeto completo
    private String imageUrl;
}
