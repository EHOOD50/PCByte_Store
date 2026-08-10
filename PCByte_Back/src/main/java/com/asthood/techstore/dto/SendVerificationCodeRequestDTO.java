package com.asthood.techstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SendVerificationCodeRequestDTO(

        @NotBlank(
                message = "El correo electrónico es obligatorio."
        )
        @Email(
                message = "El correo electrónico no tiene un formato válido."
        )
        String email

) {
}