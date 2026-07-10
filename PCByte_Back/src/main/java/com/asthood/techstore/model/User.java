package com.asthood.techstore.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter // Genera los Getters
@Setter // Genera los Setters (soluciona el error de setName)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UserStatus status = UserStatus.INVITADO;

    // --- RELACIONES ---

    // 1. Relación con Direcciones (Para usuarios REGISTRADOS)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private List<Address> addresses = new ArrayList<>();

    // 2. Relación con Órdenes (Fundamental para el historial que mencionaste)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference // ✅ Permite que al ver el usuario, veas sus compras
    @Builder.Default
    @ToString.Exclude // Evita errores de recursión en los logs
    private List<Order> orders = new ArrayList<>();
}