package com.asthood.techstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
public class UpdateProfileDTO {

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(
            max = 100,
            message = "El nombre no puede superar los 100 caracteres."
    )
    private String firstName;

    @NotBlank(message = "El apellido es obligatorio.")
    @Size(
            max = 100,
            message = "El apellido no puede superar los 100 caracteres."
    )
    private String lastName;

    @Pattern(
            regexp = "^[0-9+()\\-\\s]*$",
            message = "El teléfono contiene caracteres no permitidos."
    )
    @Size(
            max = 25,
            message = "El teléfono no puede superar los 25 caracteres."
    )
    private String phone;
}