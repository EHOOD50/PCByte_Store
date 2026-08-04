package com.asthood.techstore.service.system;

import com.asthood.techstore.dto.system.SystemServiceStatusDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MailHealthChecker
        implements SystemHealthChecker {

    private final JavaMailSender javaMailSender;

    @Override
    public String getKey() {
        return "mail";
    }

    @Override
    public SystemServiceStatusDTO check() {

        long startTime =
                System.nanoTime();

        try {
            if (!(javaMailSender instanceof JavaMailSenderImpl mailSender)) {
                long responseTimeMs =
                        (
                                System.nanoTime()
                                        - startTime
                        ) / 1_000_000;

                return buildStatus(
                        "DOWN",
                        "No fue posible acceder a la configuración SMTP.",
                        responseTimeMs
                );
            }

            mailSender.testConnection();

            long responseTimeMs =
                    (
                            System.nanoTime()
                                    - startTime
                    ) / 1_000_000;

            return buildStatus(
                    "UP",
                    "Servidor de correo disponible.",
                    responseTimeMs
            );

        } catch (Exception exception) {

            long responseTimeMs =
                    (
                            System.nanoTime()
                                    - startTime
                    ) / 1_000_000;

            return buildStatus(
                    "DOWN",
                    "No fue posible conectar con el servidor de correo.",
                    responseTimeMs
            );
        }
    }

    private SystemServiceStatusDTO buildStatus(
            String status,
            String message,
            long responseTimeMs
    ) {

        return SystemServiceStatusDTO
                .builder()
                .key(getKey())
                .name("Correo SMTP")
                .category("MAIL")
                .status(status)
                .message(message)
                .responseTimeMs(responseTimeMs)
                .build();
    }
}