package com.asthood.techstore.event;

import java.time.LocalDateTime;

/*
 * Evento emitido cuando se genera un nuevo código
 * de verificación para una compra como invitado.
 *
 * El código original permanece únicamente en memoria
 * mientras el evento es procesado por el listener.
 */
public record GuestVerificationCodeRequestedEvent(

        String email,

        String rawCode,

        LocalDateTime expiresAt

) {

    public GuestVerificationCodeRequestedEvent {

        if (
                email == null ||
                        email.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El correo del evento es obligatorio."
            );
        }

        if (
                rawCode == null ||
                        rawCode.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El código de verificación es obligatorio."
            );
        }

        if (
                expiresAt == null
        ) {
            throw new IllegalArgumentException(
                    "La fecha de expiración es obligatoria."
            );
        }
    }
}