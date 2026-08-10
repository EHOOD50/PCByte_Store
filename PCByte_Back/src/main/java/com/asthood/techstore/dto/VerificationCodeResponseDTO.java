package com.asthood.techstore.dto;

import lombok.Builder;

@Builder
public record VerificationCodeResponseDTO(

        boolean verified,

        String message

) {
}