package com.asthood.techstore.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    /*
     * ID devuelto por Mercado Pago.
     * Se utiliza para conciliación y control de idempotencia.
     */
    @Column(name = "payment_id")
    private String paymentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    /*
     * Valor total de los productos antes de agregar el despacho.
     */
    @Column(
            nullable = false,
            precision = 19,
            scale = 2
    )
    private BigDecimal subtotal;

    /*
     * Costo de despacho efectivamente cobrado al cliente.
     */
    @Column(
            name = "shipping_cost",
            nullable = false,
            precision = 19,
            scale = 2
    )
    private BigDecimal shippingCost;

    /*
     * Total definitivo de la orden:
     *
     * subtotal + shippingCost
     */
    @Column(
            nullable = false,
            precision = 19,
            scale = 2
    )
    private BigDecimal total;

    // =========================================================
    // FOTOGRAFÍA DE LA COTIZACIÓN DE DESPACHO
    // =========================================================

    /*
     * Identificador de la tarifa utilizada.
     *
     * No se modela como relación JPA porque la orden debe
     * conservar su información aunque la tarifa sea eliminada
     * o modificada posteriormente.
     */
    @Column(name = "shipping_rate_id")
    private Long shippingRateId;

    @Column(
            name = "shipping_type",
            length = 50
    )
    private String shippingType;

    @Column(
            name = "shipping_label",
            length = 150
    )
    private String shippingLabel;

    @Column(
            name = "shipping_carrier",
            length = 100
    )
    private String shippingCarrier;

    @Column(
            name = "shipping_free",
            nullable = false
    )
    private Boolean shippingFree;

    @Column(name = "estimated_min_days")
    private Integer estimatedMinDays;

    @Column(name = "estimated_max_days")
    private Integer estimatedMaxDays;

    // =========================================================
    // DATOS DE CONTACTO Y ENTREGA
    // =========================================================

    /*
     * Estos campos conservan la fotografía de los datos
     * utilizados durante la compra.
     */

    @Column(name = "full_name")
    private String fullName;

    private String email;

    private String phone;

    private String street;

    private String number;

    private String apartment;

    private String city;

    private String region;

    @Column(name = "extra_info")
    private String extraInfo;

    // =========================================================
    // RELACIONES
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({
            "orders",
            "hibernateLazyInitializer",
            "handler"
    })
    private User user;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    @ToString.Exclude
    @JsonManagedReference
    private List<OrderItem> orderItems =
            new ArrayList<>();

    // =========================================================
    // LÓGICA AUTOMÁTICA
    // =========================================================

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt =
                    LocalDateTime.now();
        }

        if (status == null) {
            status =
                    OrderStatus.PENDIENTE;
        }

        /*
         * Mientras implementamos el Bloque 2, el servicio
         * antiguo todavía puede crear órdenes usando solamente
         * el campo total.
         */
        if (subtotal == null) {
            subtotal =
                    total != null
                            ? total
                            : BigDecimal.ZERO;
        }

        if (shippingCost == null) {
            shippingCost =
                    BigDecimal.ZERO;
        }

        if (shippingFree == null) {
            shippingFree =
                    shippingCost.compareTo(
                            BigDecimal.ZERO
                    ) == 0;
        }

        if (total == null) {
            total =
                    subtotal.add(
                            shippingCost
                    );
        }
    }

    public void addOrderItem(
            OrderItem item
    ) {
        if (item == null) {
            throw new IllegalArgumentException(
                    "El producto de la orden es obligatorio."
            );
        }

        if (orderItems == null) {
            orderItems =
                    new ArrayList<>();
        }

        orderItems.add(
                item
        );

        item.setOrder(
                this
        );
    }
}