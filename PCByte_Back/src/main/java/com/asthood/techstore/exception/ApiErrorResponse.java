package com.asthood.techstore.exception;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/*
 * Estructura estándar para todas las respuestas
 * de error de la API de PCByte.
 */
@Getter
@Builder
public class ApiErrorResponse {

    @Builder.Default
    private LocalDateTime timestamp =
            LocalDateTime.now();

    private int status;

    private String error;

    private String message;

    private String path;

    private Object details;
}