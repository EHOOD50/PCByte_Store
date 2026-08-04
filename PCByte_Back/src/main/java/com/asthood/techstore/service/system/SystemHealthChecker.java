package com.asthood.techstore.service.system;

import com.asthood.techstore.dto.system.SystemServiceStatusDTO;

public interface SystemHealthChecker {

    /**
     * Identificador único del servicio.
     */
    String getKey();

    /**
     * Ejecuta la comprobación del servicio.
     */
    SystemServiceStatusDTO check();
}