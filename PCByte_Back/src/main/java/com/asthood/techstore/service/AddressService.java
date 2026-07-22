package com.asthood.techstore.service;

import com.asthood.techstore.dto.AddressDTO;
import com.asthood.techstore.mapper.AddressMapper;
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
    public AddressDTO addAddressToUser(
            Long userId,
            AddressDTO request
    ) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Usuario no encontrado."
                        )
                );

        if (user.getAddresses() == null) {
            throw new IllegalStateException(
                    "La colección de direcciones del usuario no está inicializada."
            );
        }

        boolean firstAddress =
                user.getAddresses().isEmpty();

        if (request.isDefaultAddress()) {
            user.getAddresses().forEach(
                    address ->
                            address.setDefault(false)
            );
        }

        Address address = Address.builder()
                .label(normalizeLabel(request.getLabel()))
                .street(normalizeRequired(
                        request.getStreet(),
                        "La calle es obligatoria."
                ))
                .number(normalizeRequired(
                        request.getNumber(),
                        "El número es obligatorio."
                ))
                .apartment(normalizeNullable(
                        request.getApartment()
                ))
                .city(normalizeRequired(
                        request.getCity(),
                        "La comuna es obligatoria."
                ))
                .region(normalizeRequired(
                        request.getRegion(),
                        "La región es obligatoria."
                ))
                .extraInfo(normalizeNullable(
                        request.getExtraInfo()
                ))
                .isDefault(
                        firstAddress ||
                                request.isDefaultAddress()
                )
                .user(user)
                .build();

        Address savedAddress =
                addressRepository.save(address);

        return AddressMapper.toDTO(
                savedAddress
        );
    }

    @Transactional(readOnly = true)
    public List<AddressDTO> getUserAddresses(
            Long userId
    ) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException(
                    "Usuario no encontrado."
            );
        }

        return addressRepository
                .findByUserIdOrderByIsDefaultDescIdAsc(userId)
                .stream()
                .map(AddressMapper::toDTO)
                .toList();
    }

    private String normalizeLabel(
            String value
    ) {
        if (value == null || value.isBlank()) {
            return "Principal";
        }

        return normalizeText(value);
    }

    private String normalizeRequired(
            String value,
            String message
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    message
            );
        }

        return normalizeText(value);
    }

    private String normalizeNullable(
            String value
    ) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return normalizeText(value);
    }

    private String normalizeText(
            String value
    ) {
        return value
                .trim()
                .replaceAll("\\s+", " ");
    }
}