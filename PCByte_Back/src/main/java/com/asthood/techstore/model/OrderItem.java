package com.asthood.techstore.model;

import com.asthood.techstore.domain.entity.Product;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con la Orden (Padre)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @ToString.Exclude
    @JsonBackReference // ✅ CORTA EL BUCLE: Evita que el item vuelva a llamar a la orden
    private Order order;

    // Relación con el Producto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    // ✅ PROTECCIÓN: Evita que Jackson falle al intentar leer un producto "Lazy"
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Product product;

    private Integer quantity;

    private BigDecimal price;
}


