package com.asthood.techstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyVerificationCodeRequestDTO(

        @NotBlank(
                message = "El correo electrónico es obligatorio."
        )
        @Email(
                message = "El correo electrónico no tiene un formato válido."
        )
        String email,

        @NotBlank(
                message = "El código de verificación es obligatorio."
        )
        @Pattern(
                regexp = "\\d{6}",
                message = "El código debe contener exactamente 6 dígitos."
        )
        String code

) {
}