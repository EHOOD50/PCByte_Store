package com.asthood.techstore.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;      // Ejemplo: "Casa", "Oficina"
    private String street;     // Calle
    private String number;     // Número/Altura
    private String apartment;  // Depto/Oficina (Opcional)
    private String city;       // Ciudad
    private String region;     // Región/Estado
    private String extraInfo;  // Referencias (ej: "Portón rojo")

    @Builder.Default
    private boolean isDefault = false; // Para marcar la dirección favorita

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference // Evita bucles infinitos al serializar
    private User user;
}