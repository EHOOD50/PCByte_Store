package com.asthood.techstore.service.system;

import com.asthood.techstore.dto.system.SystemServiceStatusDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Component
@Order(10)
public class DatabaseHealthChecker
        implements SystemHealthChecker {

    private static final int CONNECTION_TIMEOUT_SECONDS = 2;
    private static final int QUERY_TIMEOUT_SECONDS = 2;

    private final String datasourceUrl;
    private final String datasourceUsername;
    private final String datasourcePassword;
    private final boolean simulateDatabaseDown;

    public DatabaseHealthChecker(
            @Value("${spring.datasource.url}")
            String datasourceUrl,

            @Value("${spring.datasource.username}")
            String datasourceUsername,

            @Value("${spring.datasource.password}")
            String datasourcePassword,

            @Value("${app.health.simulate-database-down:false}")
            boolean simulateDatabaseDown
    ) {
        this.datasourceUrl = datasourceUrl;
        this.datasourceUsername = datasourceUsername;
        this.datasourcePassword = datasourcePassword;
        this.simulateDatabaseDown = simulateDatabaseDown;
    }

    @Override
    public String getKey() {
        return "database";
    }

    @Override
    public SystemServiceStatusDTO check() {
        long startTime = System.nanoTime();

        /*
         * Simulación exclusiva para pruebas de desarrollo.
         *
         * Permite mostrar PostgreSQL como caído sin detener
         * realmente el servicio ni perder la autenticación.
         */
        if (simulateDatabaseDown) {
            return buildStatus(
                    "DOWN",
                    "PostgreSQL no está disponible.",
                    elapsedMilliseconds(startTime)
            );
        }

        try (
                Connection connection =
                        DriverManager.getConnection(
                                buildHealthCheckUrl(),
                                datasourceUsername,
                                datasourcePassword
                        );

                PreparedStatement statement =
                        connection.prepareStatement(
                                "SELECT 1"
                        )
        ) {
            statement.setQueryTimeout(
                    QUERY_TIMEOUT_SECONDS
            );

            try (
                    ResultSet resultSet =
                            statement.executeQuery()
            ) {
                long responseTimeMs =
                        elapsedMilliseconds(
                                startTime
                        );

                if (
                        !resultSet.next() ||
                                resultSet.getInt(1) != 1
                ) {
                    return buildStatus(
                            "DOWN",
                            "PostgreSQL respondió con un resultado inesperado.",
                            responseTimeMs
                    );
                }

                return buildStatus(
                        "UP",
                        "Conexión disponible.",
                        responseTimeMs
                );
            }

        } catch (Exception exception) {
            return buildStatus(
                    "DOWN",
                    "No fue posible conectar con PostgreSQL.",
                    elapsedMilliseconds(
                            startTime
                    )
            );
        }
    }

    private String buildHealthCheckUrl() {
        String separator =
                datasourceUrl.contains("?")
                        ? "&"
                        : "?";

        return datasourceUrl
                + separator
                + "connectTimeout="
                + CONNECTION_TIMEOUT_SECONDS
                + "&socketTimeout="
                + CONNECTION_TIMEOUT_SECONDS;
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
                .name("PostgreSQL")
                .category("DATABASE")
                .status(status)
                .message(message)
                .responseTimeMs(
                        responseTimeMs
                )
                .build();
    }
}