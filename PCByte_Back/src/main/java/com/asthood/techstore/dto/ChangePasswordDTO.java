package com.asthood.techstore.dto;

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
public class ChangePasswordDTO {

    @NotBlank(
            message =
                    "La contraseña actual es obligatoria."
    )
    @Size(
            min = 8,
            max = 72,
            message =
                    "La contraseña actual debe contener entre 8 y 72 caracteres."
    )
    private String currentPassword;

    @NotBlank(
            message =
                    "La nueva contraseña es obligatoria."
    )
    @Size(
            min = 8,
            max = 72,
            message =
                    "La nueva contraseña debe contener entre 8 y 72 caracteres."
    )
    private String newPassword;

    @NotBlank(
            message =
                    "Debes confirmar la nueva contraseña."
    )
    @Size(
            min = 8,
            max = 72,
            message =
                    "La confirmación debe contener entre 8 y 72 caracteres."
    )
    private String confirmPassword;
}