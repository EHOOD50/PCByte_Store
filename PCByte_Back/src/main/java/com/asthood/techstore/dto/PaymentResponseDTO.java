package com.asthood.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PaymentResponseDTO {
    private String checkoutUrl; // El init_point de MP

}