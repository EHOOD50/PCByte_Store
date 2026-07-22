package com.asthood.techstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(
            max = 100,
            message = "El nombre no puede superar 100 caracteres"
    )
    private String firstName;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(
            max = 100,
            message = "El apellido no puede superar 100 caracteres"
    )
    private String lastName;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no tiene un formato válido")
    @Size(
            max = 255,
            message = "El correo no puede superar 255 caracteres"
    )
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(
            min = 8,
            max = 72,
            message = "La contraseña debe contener entre 8 y 72 caracteres"
    )
    private String password;

    @Size(
            max = 30,
            message = "El teléfono no puede superar 30 caracteres"
    )
    private String phone;

    @Size(
            max = 50,
            message = "La etiqueta no puede superar 50 caracteres"
    )
    private String addressLabel;

    @Size(
            max = 150,
            message = "La calle no puede superar 150 caracteres"
    )
    private String street;

    @Size(
            max = 30,
            message = "El número no puede superar 30 caracteres"
    )
    private String number;

    /*
     * Aquí se guardará el complemento concatenado:
     *
     * Departamento 1203
     * Torre B
     * Block 4
     * Parcela 7
     * Sitio 12
     */
    @Size(
            max = 100,
            message = "El complemento de dirección no puede superar 100 caracteres"
    )
    private String apartment;

    @Size(
            max = 100,
            message = "La comuna no puede superar 100 caracteres"
    )
    private String city;

    @Size(
            max = 100,
            message = "La región no puede superar 100 caracteres"
    )
    private String region;

    /*
     * Referencias libres para facilitar el despacho.
     * Ejemplo: Alameda entre Maipú y Chacabuco.
     */
    @Size(
            max = 255,
            message = "La referencia para el despacho no puede superar 255 caracteres"
    )
    private String extraInfo;
}