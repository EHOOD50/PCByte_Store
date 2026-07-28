package com.asthood.techstore.exception;

import org.springframework.http.HttpStatus;

/*
 * Errores controlados relacionados con los tokens
 * del sistema de identidad.
 *
 * Cada código define:
 *
 * - el estado HTTP que devolverá la API;
 * - el mensaje legible para el cliente.
 */
public enum VerificationTokenErrorCode {

    TOKEN_INVALID(
            HttpStatus.BAD_REQUEST,
            "El enlace de verificación no es válido."
    ),

    TOKEN_EXPIRED(
            HttpStatus.GONE,
            "El enlace de verificación ha vencido."
    ),

    TOKEN_ALREADY_USED(
            HttpStatus.CONFLICT,
            "El enlace de verificación ya fue utilizado."
    ),

    TOKEN_INVALIDATED(
            HttpStatus.CONFLICT,
            "El enlace de verificación fue reemplazado o invalidado."
    ),

    TOKEN_PURPOSE_MISMATCH(
            HttpStatus.BAD_REQUEST,
            "El enlace no puede utilizarse para esta operación."
    ),

    TOO_MANY_REQUESTS(
            HttpStatus.TOO_MANY_REQUESTS,
            "Se realizaron demasiadas solicitudes. Espera antes de intentarlo nuevamente."
    ),

    ACCOUNT_ALREADY_ACTIVE(
            HttpStatus.CONFLICT,
            "La cuenta ya se encuentra activa."
    ),

    ACCOUNT_NOT_PENDING(
            HttpStatus.CONFLICT,
            "La cuenta no se encuentra pendiente de verificación."
    ),

    USER_NOT_FOUND(
            HttpStatus.BAD_REQUEST,
            "No fue posible procesar la verificación solicitada."
    );

    private final HttpStatus httpStatus;
    private final String defaultMessage;

    VerificationTokenErrorCode(
            HttpStatus httpStatus,
            String defaultMessage
    ) {
        this.httpStatus =
                httpStatus;

        this.defaultMessage =
                defaultMessage;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}