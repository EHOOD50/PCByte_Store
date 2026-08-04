package com.asthood.techstore.service.system;

import com.asthood.techstore.dto.system.SystemServiceStatusDTO;
import com.asthood.techstore.dto.system.SystemStatusDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemStatusService {

    private final List<SystemHealthChecker> healthCheckers;

    public SystemStatusDTO getSystemStatus() {
        List<SystemServiceStatusDTO> services =
                healthCheckers
                        .stream()
                        .map(
                                this::executeSafely
                        )
                        .toList();

        return SystemStatusDTO
                .builder()
                .overallStatus(
                        calculateOverallStatus(
                                services
                        )
                )
                .checkedAt(
                        LocalDateTime.now()
                )
                .services(
                        services
                )
                .build();
    }

    private SystemServiceStatusDTO executeSafely(
            SystemHealthChecker checker
    ) {
        try {
            return checker.check();

        } catch (Exception exception) {
            return SystemServiceStatusDTO
                    .builder()
                    .key(
                            checker.getKey()
                    )
                    .name(
                            checker.getKey()
                    )
                    .category(
                            "SYSTEM"
                    )
                    .status(
                            "DOWN"
                    )
                    .message(
                            "El verificador no pudo completar la comprobación."
                    )
                    .responseTimeMs(
                            0L
                    )
                    .build();
        }
    }

    private String calculateOverallStatus(
            List<SystemServiceStatusDTO> services
    ) {
        if (services.isEmpty()) {
            return "UNKNOWN";
        }

        long downServices =
                services
                        .stream()
                        .filter(
                                service ->
                                        "DOWN".equalsIgnoreCase(
                                                service.getStatus()
                                        )
                        )
                        .count();

        if (downServices == services.size()) {
            return "DOWN";
        }

        boolean hasIncident =
                services
                        .stream()
                        .anyMatch(
                                service ->
                                        !"UP".equalsIgnoreCase(
                                                service.getStatus()
                                        )
                        );

        return hasIncident
                ? "DEGRADED"
                : "UP";
    }
}