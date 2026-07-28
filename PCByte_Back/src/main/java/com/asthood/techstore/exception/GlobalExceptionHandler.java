package com.asthood.techstore.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /*
     * 404 - Producto no encontrado.
     */
    @ExceptionHandler(
            ProductNotFoundException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleProductNotFound(
            ProductNotFoundException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request,
                null
        );
    }

    /*
     * 404 - Entidad o recurso no encontrado.
     *
     * Se utiliza, por ejemplo, cuando no existe:
     *
     * - una orden;
     * - la última orden de un usuario;
     * - una dirección;
     * - cualquier otra entidad solicitada mediante JPA.
     */
    @ExceptionHandler(
            EntityNotFoundException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleEntityNotFoundException(
            EntityNotFoundException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request,
                null
        );
    }

    /*
     * Errores controlados del sistema de identidad
     * y verificación de tokens.
     */
    @ExceptionHandler(
            VerificationTokenException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleVerificationTokenException(
            VerificationTokenException exception,
            HttpServletRequest request
    ) {
        HttpStatus status =
                exception
                        .getErrorCode()
                        .getHttpStatus();

        Map<String, Object> details =
                new LinkedHashMap<>();

        details.put(
                "code",
                exception
                        .getErrorCode()
                        .name()
        );

        return buildResponse(
                status,
                exception.getMessage(),
                request,
                details
        );
    }

    /*
     * 400 - Errores detectados mediante @Valid.
     */
    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleValidationErrors(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        Map<String, String> fieldErrors =
                new LinkedHashMap<>();

        exception
                .getBindingResult()
                .getFieldErrors()
                .forEach(
                        fieldError ->
                                fieldErrors.put(
                                        fieldError.getField(),
                                        fieldError.getDefaultMessage()
                                )
                );

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Existen datos inválidos en la solicitud.",
                request,
                fieldErrors
        );
    }

    /*
     * 400 - Errores de negocio o argumentos inválidos.
     *
     * Aquí se procesan, por ejemplo:
     *
     * - contraseña actual incorrecta;
     * - correo obligatorio;
     * - dirección inválida;
     * - identificadores nulos o menores que cero;
     * - campos obligatorios faltantes.
     */
    @ExceptionHandler(
            IllegalArgumentException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleIllegalArgumentException(
            IllegalArgumentException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request,
                null
        );
    }

    /*
     * 409 - Estado inválido de una operación.
     *
     * Se utiliza para errores como:
     *
     * - una operación incompatible con el estado actual;
     * - stock insuficiente;
     * - paymentId asociado a otra orden;
     * - cuenta bloqueada;
     * - conflictos de negocio.
     */
    @ExceptionHandler(
            IllegalStateException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleIllegalStateException(
            IllegalStateException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.CONFLICT,
                exception.getMessage(),
                request,
                null
        );
    }

    /*
     * 500 - Error inesperado.
     *
     * El detalle real se registra en el servidor,
     * pero no se expone al frontend.
     */
    @ExceptionHandler(
            Exception.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleGeneralException(
            Exception exception,
            HttpServletRequest request
    ) {
        exception.printStackTrace();

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocurrió un error interno. Inténtalo nuevamente más tarde.",
                request,
                null
        );
    }

    /*
     * Construye todas las respuestas de error
     * con el mismo formato.
     */
    private ResponseEntity<ApiErrorResponse>
    buildResponse(
            HttpStatus status,
            String message,
            HttpServletRequest request,
            Object details
    ) {
        ApiErrorResponse response =
                ApiErrorResponse.builder()
                        .status(
                                status.value()
                        )
                        .error(
                                status.getReasonPhrase()
                        )
                        .message(
                                normalizeMessage(
                                        message,
                                        status
                                )
                        )
                        .path(
                                request.getRequestURI()
                        )
                        .details(
                                details
                        )
                        .build();

        return ResponseEntity
                .status(status)
                .body(response);
    }

    private String normalizeMessage(
            String message,
            HttpStatus status
    ) {
        if (
                message != null &&
                        !message.isBlank()
        ) {
            return message;
        }

        return status.getReasonPhrase();
    }
}