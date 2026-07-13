package com.asthood.techstore.mapper;

import com.asthood.techstore.domain.entity.Product;
import com.asthood.techstore.dto.ProductCreateDTO;
import com.asthood.techstore.dto.ProductDTO;

public class ProductMapper {

    public static ProductDTO toDTO(Product entity) {
        if (entity == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();

        dto.setId(entity.getId());
        dto.setInternalCode(entity.getInternalCode());
        dto.setSku(entity.getSku());
        dto.setMpn(entity.getMpn());

        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setSpecifications(entity.getSpecifications());
        dto.setWarranty(entity.getWarranty());

        dto.setPrice(entity.getPrice());
        dto.setStock(entity.getStock());
        dto.setActive(entity.getActive());

        dto.setImageUrl(entity.getImageUrl());

        if (entity.getCategory() != null) {
            dto.setCategoryId(entity.getCategory().getId());
            dto.setCategoryName(entity.getCategory().getName());
        }

        if (entity.getBrand() != null) {
            dto.setBrandId(entity.getBrand().getId());
            dto.setBrandName(entity.getBrand().getName());
        }

        return dto;
    }

    public static Product toEntity(ProductCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        Product entity = new Product();

        entity.setSku(dto.getSku());
        entity.setMpn(dto.getMpn());

        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setSpecifications(dto.getSpecifications());
        entity.setWarranty(dto.getWarranty());

        entity.setPrice(dto.getPrice());
        entity.setStock(dto.getStock());
        entity.setActive(dto.getActive() != null ? dto.getActive() : true);

        entity.setImageUrl(dto.getImageUrl());

        /*
         * category y brand se asignan en ProductService,
         * porque ahí se consultan desde sus repositorios.
         *
         * internalCode se genera en ProductService después
         * de obtener el id definitivo del producto.
         */

        return entity;
    }
}