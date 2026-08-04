package com.asthood.techstore.dto.system;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class SystemStatusDTO {

    private String overallStatus;

    private LocalDateTime checkedAt;

    private List<SystemServiceStatusDTO> services;
}