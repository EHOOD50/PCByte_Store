package com.asthood.techstore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

/*
 * Fuente central de tiempo para PCByte.
 *
 * Utilizar Clock permite probar vencimientos sin depender
 * directamente del reloj real del sistema.
 */
@Configuration
public class TimeConfig {

    /*
     * Todas las fechas internas del sistema de identidad
     * se calculan en UTC.
     */
    @Bean
    public Clock applicationClock() {
        return Clock.systemUTC();
    }
}