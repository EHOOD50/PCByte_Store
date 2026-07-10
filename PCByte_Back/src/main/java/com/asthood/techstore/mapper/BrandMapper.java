package com.asthood.techstore.mapper;

import com.asthood.techstore.domain.entity.Brand;
import com.asthood.techstore.dto.BrandDTO;

public class BrandMapper {

    public static BrandDTO toDTO(Brand entity) {
        if (entity == null) return null;

        BrandDTO dto = new BrandDTO();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setLogoUrl(entity.getLogoUrl());
        dto.setWebsite(entity.getWebsite());
        dto.setActive(entity.getActive());

        return dto;
    }

    public static Brand toEntity(BrandDTO dto) {
        if (dto == null) return null;

        Brand entity = new Brand();

        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setLogoUrl(dto.getLogoUrl());
        entity.setWebsite(dto.getWebsite());
        entity.setActive(dto.getActive());

        return entity;
    }
}