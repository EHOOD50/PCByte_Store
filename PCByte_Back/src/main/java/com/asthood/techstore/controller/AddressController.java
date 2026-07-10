package com.asthood.techstore.controller;

import com.asthood.techstore.model.Address;
import com.asthood.techstore.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Ajusta esto según tu configuración de seguridad
public class AddressController {

    private final AddressService addressService;

    @PostMapping("/user/{userId}")
    public Address addAddress(@PathVariable Long userId, @RequestBody Address address) {
        return addressService.addAddressToUser(userId, address);
    }

    @GetMapping("/user/{userId}")
    public List<Address> getAddresses(@PathVariable Long userId) {
        return addressService.getUserAddresses(userId);
    }
}