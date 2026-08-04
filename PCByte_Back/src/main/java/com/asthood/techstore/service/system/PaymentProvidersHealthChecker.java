package com.asthood.techstore.service.system;

import com.asthood.techstore.dto.system.SystemServiceStatusDTO;
import com.mercadopago.client.user.UserClient;
import com.mercadopago.resources.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentProvidersHealthChecker
        implements SystemHealthChecker {

    @Override
    public String getKey() {
        return "payments";
    }

    @Override
    public SystemServiceStatusDTO check() {
        long startTime =
                System.nanoTime();

        try {
            UserClient userClient =
                    new UserClient();

            User user =
                    userClient.get();

            long responseTimeMs =
                    elapsedMilliseconds(
                            startTime
                    );

            if (
                    user == null ||
                            user.getId() == null
            ) {
                return buildStatus(
                        "DOWN",
                        "Mercado Pago respondió sin información válida de la cuenta.",
                        responseTimeMs
                );
            }

            return buildStatus(
                    "UP",
                    "Mercado Pago respondió correctamente.",
                    responseTimeMs
            );

        } catch (Exception exception) {
            long responseTimeMs =
                    elapsedMilliseconds(
                            startTime
                    );

            return buildStatus(
                    "DOWN",
                    "No fue posible conectar con Mercado Pago.",
                    responseTimeMs
            );
        }
    }

    private long elapsedMilliseconds(
            long startTime
    ) {
        return (
                System.nanoTime()
                        - startTime
        ) / 1_000_000;
    }

    private SystemServiceStatusDTO buildStatus(
            String status,
            String message,
            long responseTimeMs
    ) {
        return SystemServiceStatusDTO
                .builder()
                .key(getKey())
                .name("Mercado Pago")
                .category("PAYMENT")
                .status(status)
                .message(message)
                .responseTimeMs(
                        responseTimeMs
                )
                .build();
    }
}