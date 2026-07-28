package com.asthood.techstore.config;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

/*
 * Políticas configurables del sistema de verificación.
 *
 * Permite ajustar vencimientos y límites sin modificar
 * ni recompilar el código del servicio.
 */
@Getter
@Setter
@Component
@Validated
@ConfigurationProperties(
        prefix = "app.verification"
)
public class VerificationProperties {

    /*
     * Cantidad máxima de tokens que puede solicitar
     * un mismo correo durante una hora.
     */
    @Min(1)
    private int maxRequestsPerHour = 5;

    /*
     * Tiempo mínimo entre dos solicitudes consecutivas
     * para el mismo correo y propósito.
     */
    @Min(1)
    private long resendCooldownSeconds = 60;

    /*
     * Vigencia del enlace utilizado para activar
     * una cuenta registrada.
     */
    @Min(1)
    private long emailVerificationExpirationHours = 24;

    /*
     * Vigencia del código o token utilizado durante
     * un checkout como invitado.
     */
    @Min(1)
    private long guestCheckoutExpirationMinutes = 10;

    /*
     * Vigencia de la autorización para convertir
     * inmediatamente una compra invitada en cuenta.
     */
    @Min(1)
    private long guestAccountConversionExpirationHours = 1;

    /*
     * Vigencia de un futuro token de recuperación
     * de contraseña.
     */
    @Min(1)
    private long passwordResetExpirationMinutes = 30;
}