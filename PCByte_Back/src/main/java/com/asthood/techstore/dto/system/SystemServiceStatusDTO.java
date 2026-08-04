package com.asthood.techstore.dto.system;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SystemServiceStatusDTO {

    private String key;

    private String name;

    private String category;

    private String status;

    private String message;

    private Long responseTimeMs;
}