package com.asthood.techstore.service.system;

import com.asthood.techstore.dto.system.SystemServiceStatusDTO;
import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class CloudinaryHealthChecker
        implements SystemHealthChecker {

    private final Cloudinary cloudinary;

    @Override
    public String getKey() {
        return "cloudinary";
    }

    @Override
    public SystemServiceStatusDTO check() {

        long startTime =
                System.nanoTime();

        try {
            Map<?, ?> response =
                    cloudinary
                            .api()
                            .ping(
                                    Map.of()
                            );

            long responseTimeMs =
                    (
                            System.nanoTime()
                                    - startTime
                    ) / 1_000_000;

            Object statusValue =
                    response.get(
                            "status"
                    );

            boolean available =
                    statusValue != null &&
                            "ok".equalsIgnoreCase(
                                    statusValue.toString()
                            );

            if (!available) {
                return buildStatus(
                        "DOWN",
                        "Cloudinary respondió con un estado inesperado.",
                        responseTimeMs
                );
            }

            return buildStatus(
                    "UP",
                    "Servicio de almacenamiento disponible.",
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
                    "No fue posible conectar con Cloudinary.",
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
                .name("Cloudinary")
                .category("STORAGE")
                .status(status)
                .message(message)
                .responseTimeMs(responseTimeMs)
                .build();
    }
}