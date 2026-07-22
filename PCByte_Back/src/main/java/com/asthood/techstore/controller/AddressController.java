package com.asthood.techstore.controller;

import com.asthood.techstore.dto.AddressDTO;
import com.asthood.techstore.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AddressController {

    private final AddressService addressService;

    @PostMapping("/user/{userId}")
    public AddressDTO addAddress(
            @PathVariable Long userId,
            @RequestBody AddressDTO address
    ) {
        return addressService.addAddressToUser(
                userId,
                address
        );
    }

    @GetMapping("/user/{userId}")
    public List<AddressDTO> getAddresses(
            @PathVariable Long userId
    ) {
        return addressService.getUserAddresses(
                userId
        );
    }
}