package com.asthood.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayerDTO {
    private String name;
    private String email;
    private String phone;
    // Campos para el Snapshot
    private String street;
    private String number;
    private String apartment;
    private String city;
    private String region;
    private String extraInfo;
}
