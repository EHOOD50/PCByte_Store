package com.asthood.techstore.event;

import java.time.LocalDateTime;

/*
 * Evento emitido cuando ya se preparó un token
 * para verificar el correo de una cuenta.
 *
 * Contiene el token original solamente mientras
 * el evento permanece en memoria. PostgreSQL conserva
 * exclusivamente el hash SHA-256.
 */
public record EmailVerificationRequestedEvent(
        String firstName,
        String email,
        String rawToken,
        LocalDateTime expiresAt
) {

    public EmailVerificationRequestedEvent {
        if (
                email == null ||
                        email.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El correo del evento de verificación es obligatorio."
            );
        }

        if (
                rawToken == null ||
                        rawToken.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El token del evento de verificación es obligatorio."
            );
        }

        if (expiresAt == null) {
            throw new IllegalArgumentException(
                    "La fecha de vencimiento del token es obligatoria."
            );
        }
    }
}