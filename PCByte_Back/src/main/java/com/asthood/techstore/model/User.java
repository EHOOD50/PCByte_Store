package com.asthood.techstore.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
            name = "first_name",
            length = 100
    )
    private String firstName;

    @Column(
            name = "last_name",
            length = 100
    )
    private String lastName;

    /*
     * Identificador permanente de la cuenta.
     *
     * No se modifica desde el perfil del cliente.
     */
    @Column(
            unique = true,
            nullable = false,
            length = 255
    )
    private String email;

    @Column(
            length = 255
    )
    private String password;

    @Column(
            length = 30
    )
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 40
    )
    @Builder.Default
    private UserStatus status =
            UserStatus.INVITADO;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 20
    )
    @Builder.Default
    private UserRole role =
            UserRole.USER;
    /*
     * Fecha en que se creó el registro.
     */
    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    /*
     * Fecha de la última modificación de los datos
     * actuales del cliente.
     *
     * No modifica la información histórica almacenada
     * dentro de las órdenes.
     */
    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;

    /*
     * Momento en que el cliente demostró tener acceso
     * al correo asociado a la cuenta.
     */
    @Column(
            name = "email_verified_at"
    )
    private LocalDateTime emailVerifiedAt;

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Address> addresses =
            new ArrayList<>();

    /*
     * Las órdenes contienen su propia fotografía histórica.
     *
     * Los cambios posteriores en nombre, teléfono, correo
     * o direcciones no modifican pedidos ya realizados.
     */
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Order> orders =
            new ArrayList<>();

    @PrePersist
    private void onCreate() {
        LocalDateTime now =
                LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    private void onUpdate() {
        updatedAt =
                LocalDateTime.now();
    }

    /*
     * Deja una cuenta nueva o una cuenta invitada
     * esperando la comprobación del correo.
     */
    public void markEmailVerificationPending() {
        status =
                UserStatus
                        .EMAIL_PENDIENTE_VERIFICACION;

        emailVerifiedAt =
                null;
    }

    /*
     * Activa la cuenta después de consumir correctamente
     * un token de verificación.
     *
     * La fecha se recibe desde el servicio para utilizar
     * el Clock central de la aplicación.
     */
    public void verifyEmail(
            LocalDateTime verifiedAt
    ) {
        if (verifiedAt == null) {
            throw new IllegalArgumentException(
                    "La fecha de verificación es obligatoria."
            );
        }

        emailVerifiedAt =
                verifiedAt;

        status =
                UserStatus.REGISTRADO;
    }

    public boolean isEmailVerified() {
        return emailVerifiedAt != null;
    }

    public boolean isGuest() {
        return status ==
                UserStatus.INVITADO;
    }

    public boolean isEmailVerificationPending() {
        return status ==
                UserStatus
                        .EMAIL_PENDIENTE_VERIFICACION;
    }

    public boolean isRegistered() {
        return status ==
                UserStatus.REGISTRADO;
    }
}