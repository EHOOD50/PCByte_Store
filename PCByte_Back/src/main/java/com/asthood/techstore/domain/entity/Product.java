package com.asthood.techstore.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    /*
     * Código interno estable de PCByte.
     * Su generación se implementará en la capa Service.
     */
    @Column(name = "internal_code", length = 30, unique = true)
    private String internalCode;

    /*
     * Código comercial del producto.
     * Se ingresa desde el panel administrativo.
     */
    @Size(max = 100, message = "El SKU no puede superar 100 caracteres")
    @Column(length = 100)
    private String sku;

    /*
     * Número de parte asignado por el fabricante.
     */
    @Size(max = 100, message = "El MPN no puede superar 100 caracteres")
    @Column(length = 100)
    private String mpn;

    @NotNull(message = "El nombre es obligatorio")
    @Size(max = 255, message = "El nombre no puede superar 255 caracteres")
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String specifications;

    @Column(columnDefinition = "TEXT")
    private String warranty;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal price;

    @NotNull(message = "El stock es obligatorio")
    @PositiveOrZero(message = "El stock no puede ser negativo")
    @Column(nullable = false)
    private Integer stock;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @NotNull(message = "La categoría es obligatoria")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "image_url")
    @JsonProperty("imageUrl")
    private String imageUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (active == null) {
            active = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}