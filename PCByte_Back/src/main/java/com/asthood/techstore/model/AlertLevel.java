package com.asthood.techstore.model;

public enum AlertLevel {

    /**
     * Requiere acción inmediata.
     */
    CRITICAL,

    /**
     * Debe revisarse durante la jornada.
     */
    WARNING,

    /**
     * Información relevante, sin urgencia.
     */
    INFO,

    /**
     * Todo funciona correctamente.
     */
    SUCCESS
}