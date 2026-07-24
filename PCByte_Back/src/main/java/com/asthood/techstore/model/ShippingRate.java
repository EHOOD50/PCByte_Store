package com.asthood.techstore.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipping_rates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Nombre visible para el administrador.
     *
     * Ejemplo:
     * RM General
     * Pudahuel Express
     * Chile
     */
    @Column(nullable = false, length = 100)
    private String name;

    /*
     * Región.
     *
     * NULL = aplica a todo Chile.
     */
    @Column(length = 120)
    private String region;

    /*
     * Comuna.
     *
     * NULL = aplica a toda la región.
     */
    @Column(length = 120)
    private String city;

    /*
     * HOME_DELIVERY
     * EXPRESS
     * STORE_PICKUP
     */
    @Column(name = "shipping_type", nullable = false, length = 50)
    private String shippingType;

    /*
     * Empresa de transporte.
     *
     * Chilexpress
     * Bluexpress
     * Starken
     * PCByte
     */
    @Column(length = 80)
    private String carrier;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    /*
     * Si el subtotal supera este monto,
     * el despacho será gratuito.
     *
     * NULL = nunca gratuito.
     */
    @Column(name = "free_shipping_from", precision = 12, scale = 2)
    private BigDecimal freeShippingFrom;

    @Column(name = "estimated_min_days", nullable = false)
    private Integer estimatedMinDays;

    @Column(name = "estimated_max_days", nullable = false)
    private Integer estimatedMaxDays;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Builder.Default
    @Column(nullable = false)
    private Integer priority = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }
}