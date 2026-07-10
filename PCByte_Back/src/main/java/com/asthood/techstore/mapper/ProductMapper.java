package com.asthood.techstore.mapper;

import com.asthood.techstore.domain.entity.Product;
import com.asthood.techstore.dto.ProductCreateDTO;
import com.asthood.techstore.dto.ProductDTO;

public class ProductMapper {

    public static ProductDTO toDTO(Product entity) {
        if (entity == null) return null;

        ProductDTO dto = new ProductDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setStock(entity.getStock());

        // ✅ CORRECCIÓN: Pasamos de la Entidad al DTO para mostrarlo al cliente
        dto.setImageUrl(entity.getImageUrl());

        dto.setCategory(entity.getCategory());

        if (entity.getBrand() != null) {
            dto.setBrandId(entity.getBrand().getId());
            dto.setBrandName(entity.getBrand().getName());
        }

        return dto;
    }

    public static Product toEntity(ProductCreateDTO dto) {
        if (dto == null) return null;

        Product entity = new Product();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setStock(dto.getStock());

        // ✅ CORRECCIÓN: Pasamos del DTO a la Entidad para guardarlo en la DB
        entity.setImageUrl(dto.getImageUrl());

        // La categoría se asigna en el Service
        return entity;
    }
}