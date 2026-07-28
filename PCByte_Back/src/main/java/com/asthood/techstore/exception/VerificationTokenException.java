package com.asthood.techstore.exception;

import lombok.Getter;

/*
 * Excepción controlada para errores del sistema
 * de tokens y verificación de identidad.
 */
@Getter
public class VerificationTokenException
        extends RuntimeException {

    private final VerificationTokenErrorCode errorCode;

    /*
     * Utiliza el mensaje predeterminado definido
     * por el código de error.
     */
    public VerificationTokenException(
            VerificationTokenErrorCode errorCode
    ) {
        super(
                errorCode.getDefaultMessage()
        );

        this.errorCode =
                errorCode;
    }

    /*
     * Permite utilizar un mensaje específico cuando
     * el contexto de la operación lo requiere.
     */
    public VerificationTokenException(
            VerificationTokenErrorCode errorCode,
            String message
    ) {
        super(
                message == null ||
                        message.isBlank()
                        ? errorCode.getDefaultMessage()
                        : message
        );

        this.errorCode =
                errorCode;
    }
}