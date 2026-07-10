package com.asthood.techstore.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El nombre es obligatorio")
    @Size(max = 255, message = "El nombre no puede superar 255 caracteres")
    @Column(nullable = false)
    private String name;


    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    @Column(nullable = false)
    private BigDecimal price;

    @NotNull(message = "El stock es obligatorio")
    @Positive(message = "El stock debe ser mayor a 0")
    @Column(nullable = false)
    private Integer stock;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @NotNull(message = "La categoría es obligatoria") // Usa NotNull para objetos
    private Category category;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "image_url")
    @JsonProperty("imageUrl") // Esto fuerza a Java a entender "imageUrl" desde el JSON
    private String imageUrl;
}
