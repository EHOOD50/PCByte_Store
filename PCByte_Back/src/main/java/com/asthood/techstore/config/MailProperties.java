package com.asthood.techstore.config;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Component
@Validated
@ConfigurationProperties(
        prefix = "app.mail"
)
public class MailProperties {

    @NotBlank(
            message =
                    "El correo remitente es obligatorio."
    )
    @Email(
            message =
                    "El correo remitente no tiene un formato válido."
    )
    private String fromAddress;

    @NotBlank(
            message =
                    "El nombre del remitente es obligatorio."
    )
    private String fromName;

    @NotBlank(
            message =
                    "El correo de respuesta es obligatorio."
    )
    @Email(
            message =
                    "El correo de respuesta no tiene un formato válido."
    )
    private String replyTo;
}