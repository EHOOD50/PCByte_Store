package com.asthood.techstore.service;

import com.asthood.techstore.model.Address;
import com.asthood.techstore.model.User;
import com.asthood.techstore.repository.AddressRepository;
import com.asthood.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Transactional
    public Address addAddressToUser(Long userId, Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Si es la primera dirección, la marcamos como predeterminada automáticamente
        if (user.getAddresses().isEmpty()) {
            address.setDefault(true);
        }

        address.setUser(user);
        return addressRepository.save(address);
    }

    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }
}