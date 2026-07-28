package com.asthood.techstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class ResendVerificationRequestDTO {

    @NotBlank(
            message =
                    "El correo es obligatorio."
    )
    @Email(
            message =
                    "El correo no tiene un formato válido."
    )
    @Size(
            max = 255,
            message =
                    "El correo no puede superar los 255 caracteres."
    )
    private String email;
}