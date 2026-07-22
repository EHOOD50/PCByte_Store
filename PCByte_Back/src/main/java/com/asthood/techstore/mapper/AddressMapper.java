package com.asthood.techstore.mapper;

import com.asthood.techstore.dto.AddressDTO;
import com.asthood.techstore.model.Address;

public final class AddressMapper {

    private AddressMapper() {
    }

    public static AddressDTO toDTO(Address address) {

        if (address == null) {
            return null;
        }

        return AddressDTO.builder()
                .id(address.getId())
                .label(address.getLabel())
                .street(address.getStreet())
                .number(address.getNumber())
                .apartment(address.getApartment())
                .city(address.getCity())
                .region(address.getRegion())
                .extraInfo(address.getExtraInfo())
                .defaultAddress(address.isDefault())
                .build();
    }
}