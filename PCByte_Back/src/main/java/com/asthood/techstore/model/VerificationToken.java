package com.asthood.techstore.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "verification_tokens",
        indexes = {
                @Index(
                        name = "idx_verification_tokens_email_purpose",
                        columnList = "email,purpose"
                ),
                @Index(
                        name = "idx_verification_tokens_user_purpose",
                        columnList = "user_id,purpose"
                ),
                @Index(
                        name = "idx_verification_tokens_expires_at",
                        columnList = "expires_at"
                )
        },
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_verification_token_hash",
                        columnNames = "token_hash"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationToken {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    /*
     * Es nullable para permitir verificaciones de checkout
     * invitado que todavía no estén vinculadas a un usuario.
     */
    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = true
    )
    @JoinColumn(
            name = "user_id",
            foreignKey = @ForeignKey(
                    name = "fk_verification_token_user"
            )
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    /*
     * Correo normalizado al que se envió la verificación.
     *
     * Se conserva incluso cuando existe user_id para mantener
     * una fotografía del destino utilizado por el token.
     */
    @Column(
            nullable = false,
            length = 255
    )
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 50
    )
    private VerificationPurpose purpose;

    /*
     * SHA-256 del token original.
     *
     * El token sin procesar solamente se envía al cliente y
     * nunca se almacena en la base de datos.
     */
    @Column(
            name = "token_hash",
            nullable = false,
            unique = true,
            length = 64
    )
    private String tokenHash;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "expires_at",
            nullable = false
    )
    private LocalDateTime expiresAt;

    /*
     * Momento en que el token fue utilizado correctamente.
     *
     * Un token utilizado no puede volver a procesarse.
     */
    @Column(
            name = "used_at"
    )
    private LocalDateTime usedAt;

    /*
     * Momento en que el token fue invalidado antes de usarse.
     *
     * Por ejemplo, al solicitar un nuevo correo de verificación.
     */
    @Column(
            name = "invalidated_at"
    )
    private LocalDateTime invalidatedAt;

    /*
     * Hash opcional de la IP que solicitó el token.
     *
     * No almacenaremos la IP original para reducir la exposición
     * de información personal.
     */
    @Column(
            name = "request_ip_hash",
            length = 64
    )
    private String requestIpHash;

    @PrePersist
    private void onCreate() {
        if (createdAt == null) {
            createdAt =
                    LocalDateTime.now();
        }
    }

    /*
     * Indica si el token ya superó su fecha de vencimiento.
     */
    public boolean isExpired() {
        return LocalDateTime.now()
                .isAfter(expiresAt);
    }

    /*
     * Indica si el token ya fue consumido.
     */
    public boolean isUsed() {
        return usedAt != null;
    }

    /*
     * Indica si el token fue invalidado explícitamente.
     */
    public boolean isInvalidated() {
        return invalidatedAt != null;
    }

    /*
     * Un token está activo solamente cuando:
     *
     * - no fue utilizado;
     * - no fue invalidado;
     * - no está vencido.
     */
    public boolean isActive() {
        return !isUsed()
                && !isInvalidated()
                && !isExpired();
    }

    public void markAsUsed() {
        if (!isUsed()) {
            usedAt =
                    LocalDateTime.now();
        }
    }

    public void invalidate() {
        if (
                !isUsed()
                        && !isInvalidated()
        ) {
            invalidatedAt =
                    LocalDateTime.now();
        }
    }
}