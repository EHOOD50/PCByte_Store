package com.asthood.techstore.controller;

import com.asthood.techstore.dto.AddressDTO;
import com.asthood.techstore.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AddressController {

    private final AddressService addressService;

    /*
     * Crea una dirección.
     */
    @PostMapping("/user/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public AddressDTO addAddress(
            @PathVariable Long userId,
            @RequestBody AddressDTO address
    ) {
        return addressService
                .addAddressToUser(
                        userId,
                        address
                );
    }

    /*
     * Lista las direcciones del cliente.
     */
    @GetMapping("/user/{userId}")
    public List<AddressDTO> getAddresses(
            @PathVariable Long userId
    ) {
        return addressService
                .getUserAddresses(
                        userId
                );
    }

    /*
     * Actualiza una dirección.
     */
    @PutMapping(
            "/user/{userId}/{addressId}"
    )
    public AddressDTO updateAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId,
            @RequestBody AddressDTO address
    ) {
        return addressService
                .updateAddress(
                        userId,
                        addressId,
                        address
                );
    }

    /*
     * Marca una dirección como predeterminada.
     */
    @PatchMapping(
            "/user/{userId}/{addressId}/default"
    )
    public AddressDTO setDefaultAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId
    ) {
        return addressService
                .setDefaultAddress(
                        userId,
                        addressId
                );
    }

    /*
     * Elimina una dirección.
     */
    @DeleteMapping(
            "/user/{userId}/{addressId}"
    )
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId
    ) {
        addressService.deleteAddress(
                userId,
                addressId
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}