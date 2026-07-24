package com.asthood.techstore.mapper;

import com.asthood.techstore.dto.ShippingRateDTO;
import com.asthood.techstore.model.ShippingRate;

public final class ShippingRateMapper {

    private ShippingRateMapper() {
    }

    public static ShippingRateDTO toDTO(
            ShippingRate entity
    ) {

        if (entity == null) {
            return null;
        }

        return ShippingRateDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .region(entity.getRegion())
                .city(entity.getCity())
                .shippingType(entity.getShippingType())
                .carrier(entity.getCarrier())
                .price(entity.getPrice())
                .freeShippingFrom(entity.getFreeShippingFrom())
                .estimatedMinDays(entity.getEstimatedMinDays())
                .estimatedMaxDays(entity.getEstimatedMaxDays())
                .active(entity.getActive())
                .priority(entity.getPriority())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static ShippingRate toEntity(
            ShippingRateDTO dto
    ) {

        if (dto == null) {
            return null;
        }

        return ShippingRate.builder()
                .id(dto.getId())
                .name(dto.getName())
                .region(dto.getRegion())
                .city(dto.getCity())
                .shippingType(dto.getShippingType())
                .carrier(dto.getCarrier())
                .price(dto.getPrice())
                .freeShippingFrom(dto.getFreeShippingFrom())
                .estimatedMinDays(dto.getEstimatedMinDays())
                .estimatedMaxDays(dto.getEstimatedMaxDays())
                .active(dto.getActive())
                .priority(dto.getPriority())
                .build();
    }
}