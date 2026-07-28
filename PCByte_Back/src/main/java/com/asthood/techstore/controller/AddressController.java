package com.asthood.techstore.controller;

import com.asthood.techstore.dto.AddressDTO;
import com.asthood.techstore.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AddressController {

    private final AddressService addressService;

    /*
     * Crea una dirección para el usuario autenticado.
     *
     * El frontend no envía userId.
     */
    @PostMapping
    @ResponseStatus(
            HttpStatus.CREATED
    )
    public AddressDTO addAddress(
            Authentication authentication,

            @Valid
            @RequestBody
            AddressDTO address
    ) {
        return addressService
                .addAddress(
                        getAuthenticatedEmail(
                                authentication
                        ),
                        address
                );
    }

    /*
     * Lista exclusivamente las direcciones
     * del usuario autenticado.
     */
    @GetMapping
    public List<AddressDTO> getAddresses(
            Authentication authentication
    ) {
        return addressService
                .getAddresses(
                        getAuthenticatedEmail(
                                authentication
                        )
                );
    }

    /*
     * Actualiza una dirección perteneciente
     * al usuario autenticado.
     */
    @PutMapping("/{addressId}")
    public AddressDTO updateAddress(
            Authentication authentication,

            @PathVariable
            Long addressId,

            @Valid
            @RequestBody
            AddressDTO address
    ) {
        return addressService
                .updateAddress(
                        getAuthenticatedEmail(
                                authentication
                        ),
                        addressId,
                        address
                );
    }

    /*
     * Marca una dirección del usuario autenticado
     * como predeterminada.
     */
    @PatchMapping(
            "/{addressId}/default"
    )
    public AddressDTO setDefaultAddress(
            Authentication authentication,

            @PathVariable
            Long addressId
    ) {
        return addressService
                .setDefaultAddress(
                        getAuthenticatedEmail(
                                authentication
                        ),
                        addressId
                );
    }

    /*
     * Elimina una dirección perteneciente
     * al usuario autenticado.
     */
    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            Authentication authentication,

            @PathVariable
            Long addressId
    ) {
        addressService.deleteAddress(
                getAuthenticatedEmail(
                        authentication
                ),
                addressId
        );

        return ResponseEntity
                .noContent()
                .build();
    }

    /*
     * Obtiene el correo verificado por Spring Security.
     *
     * El controlador nunca acepta userId como mecanismo
     * para determinar la propiedad de una dirección.
     */
    private String getAuthenticatedEmail(
            Authentication authentication
    ) {
        if (
                authentication == null ||
                        !authentication.isAuthenticated() ||
                        authentication.getName() == null ||
                        authentication.getName()
                                .isBlank()
        ) {
            throw new IllegalStateException(
                    "La solicitud requiere una cuenta autenticada."
            );
        }

        return authentication
                .getName()
                .trim();
    }
}