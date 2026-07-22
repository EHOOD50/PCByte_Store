package com.asthood.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {

    private Long id;

    private String label;

    private String street;

    private String number;

    private String apartment;

    private String city;

    private String region;

    private String extraInfo;

    private boolean defaultAddress;
}