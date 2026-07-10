package com.asthood.techstore.dto;

import lombok.Data;

@Data
public class BrandDTO {

    private Long id;

    private String name;

    private String logoUrl;

    private String website;

    private Boolean active;
}