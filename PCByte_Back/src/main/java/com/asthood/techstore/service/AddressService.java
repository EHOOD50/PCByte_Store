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

    /*
     * Crea una nueva dirección para el cliente.
     *
     * La primera dirección se establece automáticamente
     * como predeterminada.
     */
    @Transactional
    public AddressDTO addAddressToUser(
            Long userId,
            AddressDTO request
    ) {
        User user = findUser(userId);

        boolean firstAddress =
                addressRepository
                        .findByUserIdOrderByIdAsc(
                                userId
                        )
                        .isEmpty();

        boolean shouldBeDefault =
                firstAddress ||
                        request.isDefaultAddress();

        if (shouldBeDefault) {
            clearDefaultAddress(userId);
        }

        Address address = Address.builder()
                .label(
                        normalizeLabel(
                                request.getLabel()
                        )
                )
                .street(
                        normalizeRequired(
                                request.getStreet(),
                                "La calle es obligatoria."
                        )
                )
                .number(
                        normalizeRequired(
                                request.getNumber(),
                                "El número es obligatorio."
                        )
                )
                .apartment(
                        normalizeNullable(
                                request.getApartment()
                        )
                )
                .city(
                        normalizeRequired(
                                request.getCity(),
                                "La comuna es obligatoria."
                        )
                )
                .region(
                        normalizeRequired(
                                request.getRegion(),
                                "La región es obligatoria."
                        )
                )
                .extraInfo(
                        normalizeNullable(
                                request.getExtraInfo()
                        )
                )
                .isDefault(shouldBeDefault)
                .user(user)
                .build();

        Address savedAddress =
                addressRepository.save(
                        address
                );

        return AddressMapper.toDTO(
                savedAddress
        );
    }

    /*
     * Obtiene las direcciones del cliente manteniendo
     * siempre un orden estable por ID.
     */
    @Transactional(readOnly = true)
    public List<AddressDTO> getUserAddresses(
            Long userId
    ) {
        validateUserExists(userId);

        return addressRepository
                .findByUserIdOrderByIdAsc(
                        userId
                )
                .stream()
                .map(AddressMapper::toDTO)
                .toList();
    }

    /*
     * Actualiza una dirección existente.
     */
    @Transactional
    public AddressDTO updateAddress(
            Long userId,
            Long addressId,
            AddressDTO request
    ) {
        validateUserExists(userId);

        Address address =
                findUserAddress(
                        userId,
                        addressId
                );

        boolean wasDefault =
                address.isDefault();

        boolean shouldBeDefault =
                wasDefault ||
                        request.isDefaultAddress();

        if (
                request.isDefaultAddress() &&
                        !wasDefault
        ) {
            clearDefaultAddress(userId);
        }

        address.setLabel(
                normalizeLabel(
                        request.getLabel()
                )
        );

        address.setStreet(
                normalizeRequired(
                        request.getStreet(),
                        "La calle es obligatoria."
                )
        );

        address.setNumber(
                normalizeRequired(
                        request.getNumber(),
                        "El número es obligatorio."
                )
        );

        address.setApartment(
                normalizeNullable(
                        request.getApartment()
                )
        );

        address.setCity(
                normalizeRequired(
                        request.getCity(),
                        "La comuna es obligatoria."
                )
        );

        address.setRegion(
                normalizeRequired(
                        request.getRegion(),
                        "La región es obligatoria."
                )
        );

        address.setExtraInfo(
                normalizeNullable(
                        request.getExtraInfo()
                )
        );

        address.setDefault(
                shouldBeDefault
        );

        Address updatedAddress =
                addressRepository.save(
                        address
                );

        return AddressMapper.toDTO(
                updatedAddress
        );
    }

    /*
     * Marca una dirección como predeterminada sin
     * cambiar el orden en que se muestran.
     */
    @Transactional
    public AddressDTO setDefaultAddress(
            Long userId,
            Long addressId
    ) {
        validateUserExists(userId);

        Address selectedAddress =
                findUserAddress(
                        userId,
                        addressId
                );

        if (selectedAddress.isDefault()) {
            return AddressMapper.toDTO(
                    selectedAddress
            );
        }

        clearDefaultAddress(userId);

        selectedAddress.setDefault(
                true
        );

        Address savedAddress =
                addressRepository.save(
                        selectedAddress
                );

        return AddressMapper.toDTO(
                savedAddress
        );
    }

    /*
     * Elimina una dirección.
     *
     * Si se elimina la predeterminada, la primera
     * dirección restante por ID pasa a ser principal.
     */
    @Transactional
    public void deleteAddress(
            Long userId,
            Long addressId
    ) {
        validateUserExists(userId);

        Address address =
                findUserAddress(
                        userId,
                        addressId
                );

        boolean deletedAddressWasDefault =
                address.isDefault();

        addressRepository.delete(
                address
        );

        addressRepository.flush();

        if (deletedAddressWasDefault) {
            addressRepository
                    .findFirstByUserIdOrderByIdAsc(
                            userId
                    )
                    .ifPresent(
                            remainingAddress -> {
                                remainingAddress.setDefault(
                                        true
                                );

                                addressRepository.save(
                                        remainingAddress
                                );
                            }
                    );
        }
    }

    /*
     * Desmarca la dirección predeterminada actual.
     */
    private void clearDefaultAddress(
            Long userId
    ) {
        addressRepository
                .findByUserIdAndIsDefaultTrue(
                        userId
                )
                .ifPresent(
                        currentDefault -> {
                            currentDefault.setDefault(
                                    false
                            );

                            addressRepository.save(
                                    currentDefault
                            );
                        }
                );
    }

    private User findUser(
            Long userId
    ) {
        if (userId == null) {
            throw new IllegalArgumentException(
                    "El identificador del usuario es obligatorio."
            );
        }

        return userRepository
                .findById(userId)
                .orElseThrow(
                        () ->
                                new IllegalArgumentException(
                                        "Usuario no encontrado."
                                )
                );
    }

    private void validateUserExists(
            Long userId
    ) {
        if (
                userId == null ||
                        !userRepository.existsById(
                                userId
                        )
        ) {
            throw new IllegalArgumentException(
                    "Usuario no encontrado."
            );
        }
    }

    private Address findUserAddress(
            Long userId,
            Long addressId
    ) {
        if (addressId == null) {
            throw new IllegalArgumentException(
                    "El identificador de la dirección es obligatorio."
            );
        }

        return addressRepository
                .findByIdAndUserId(
                        addressId,
                        userId
                )
                .orElseThrow(
                        () ->
                                new IllegalArgumentException(
                                        "Dirección no encontrada para el usuario indicado."
                                )
                );
    }

    private String normalizeLabel(
            String value
    ) {
        if (
                value == null ||
                        value.isBlank()
        ) {
            return "Principal";
        }

        return normalizeText(value);
    }

    private String normalizeRequired(
            String value,
            String message
    ) {
        if (
                value == null ||
                        value.isBlank()
        ) {
            throw new IllegalArgumentException(
                    message
            );
        }

        return normalizeText(value);
    }

    private String normalizeNullable(
            String value
    ) {
        if (
                value == null ||
                        value.isBlank()
        ) {
            return null;
        }

        return normalizeText(value);
    }

    private String normalizeText(
            String value
    ) {
        return value
                .trim()
                .replaceAll(
                        "\\s+",
                        " "
                );
    }
}