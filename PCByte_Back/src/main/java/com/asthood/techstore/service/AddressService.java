package com.asthood.techstore.service;

import com.asthood.techstore.dto.AddressDTO;
import com.asthood.techstore.mapper.AddressMapper;
import com.asthood.techstore.model.Address;
import com.asthood.techstore.model.User;
import com.asthood.techstore.repository.AddressRepository;
import com.asthood.techstore.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    private final UserRepository userRepository;

    /*
     * Crea una nueva dirección para el usuario autenticado.
     *
     * La primera dirección se establece automáticamente
     * como predeterminada.
     */
    @Transactional
    public AddressDTO addAddress(
            String authenticatedEmail,
            AddressDTO request
    ) {
        validateRequest(
                request
        );

        User user =
                findAuthenticatedUser(
                        authenticatedEmail
                );

        Long userId =
                user.getId();

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
            clearDefaultAddress(
                    userId
            );
        }

        Address address =
                Address.builder()
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
                        .isDefault(
                                shouldBeDefault
                        )
                        .user(
                                user
                        )
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
     * Obtiene exclusivamente las direcciones
     * del usuario autenticado.
     */
    @Transactional(readOnly = true)
    public List<AddressDTO> getAddresses(
            String authenticatedEmail
    ) {
        User user =
                findAuthenticatedUser(
                        authenticatedEmail
                );

        return addressRepository
                .findByUserIdOrderByIdAsc(
                        user.getId()
                )
                .stream()
                .map(
                        AddressMapper::toDTO
                )
                .toList();
    }

    /*
     * Actualiza una dirección solamente cuando pertenece
     * al usuario autenticado.
     */
    @Transactional
    public AddressDTO updateAddress(
            String authenticatedEmail,
            Long addressId,
            AddressDTO request
    ) {
        validateRequest(
                request
        );

        User user =
                findAuthenticatedUser(
                        authenticatedEmail
                );

        Long userId =
                user.getId();

        Address address =
                findOwnedAddress(
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
            clearDefaultAddress(
                    userId
            );
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
     * Marca una dirección perteneciente al usuario
     * autenticado como predeterminada.
     */
    @Transactional
    public AddressDTO setDefaultAddress(
            String authenticatedEmail,
            Long addressId
    ) {
        User user =
                findAuthenticatedUser(
                        authenticatedEmail
                );

        Long userId =
                user.getId();

        Address selectedAddress =
                findOwnedAddress(
                        userId,
                        addressId
                );

        if (
                selectedAddress.isDefault()
        ) {
            return AddressMapper.toDTO(
                    selectedAddress
            );
        }

        clearDefaultAddress(
                userId
        );

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
     * Elimina una dirección solamente cuando pertenece
     * al usuario autenticado.
     *
     * Si se elimina la predeterminada, la primera dirección
     * restante se establece como principal.
     */
    @Transactional
    public void deleteAddress(
            String authenticatedEmail,
            Long addressId
    ) {
        User user =
                findAuthenticatedUser(
                        authenticatedEmail
                );

        Long userId =
                user.getId();

        Address address =
                findOwnedAddress(
                        userId,
                        addressId
                );

        boolean deletedAddressWasDefault =
                address.isDefault();

        addressRepository.delete(
                address
        );

        addressRepository.flush();

        if (
                deletedAddressWasDefault
        ) {
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
     * Desmarca la dirección predeterminada actual
     * del usuario indicado.
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

    /*
     * Resuelve al propietario exclusivamente mediante
     * el correo entregado por Spring Security.
     *
     * Nunca utiliza un userId recibido desde el navegador.
     */
    private User findAuthenticatedUser(
            String authenticatedEmail
    ) {
        String normalizedEmail =
                normalizeEmail(
                        authenticatedEmail
                );

        return userRepository
                .findByEmail(
                        normalizedEmail
                )
                .orElseThrow(
                        () ->
                                new EntityNotFoundException(
                                        "No fue posible encontrar la cuenta autenticada."
                                )
                );
    }

    /*
     * Busca la dirección utilizando simultáneamente:
     *
     * - addressId;
     * - ID del propietario autenticado.
     *
     * Si la dirección existe pero pertenece a otra cuenta,
     * se responde igualmente como recurso no encontrado.
     * Así no revelamos información sobre recursos ajenos.
     */
    private Address findOwnedAddress(
            Long authenticatedUserId,
            Long addressId
    ) {
        validateAddressId(
                addressId
        );

        return addressRepository
                .findByIdAndUserId(
                        addressId,
                        authenticatedUserId
                )
                .orElseThrow(
                        () ->
                                new EntityNotFoundException(
                                        "Dirección no encontrada."
                                )
                );
    }

    private void validateAddressId(
            Long addressId
    ) {
        if (
                addressId == null
        ) {
            throw new IllegalArgumentException(
                    "El identificador de la dirección es obligatorio."
            );
        }

        if (
                addressId <= 0
        ) {
            throw new IllegalArgumentException(
                    "El identificador de la dirección debe ser mayor que cero."
            );
        }
    }

    private void validateRequest(
            AddressDTO request
    ) {
        if (
                request == null
        ) {
            throw new IllegalArgumentException(
                    "Los datos de la dirección son obligatorios."
            );
        }
    }

    private String normalizeEmail(
            String email
    ) {
        if (
                email == null ||
                        email.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "No fue posible identificar al usuario autenticado."
            );
        }

        return email
                .trim()
                .toLowerCase(
                        Locale.ROOT
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

        return normalizeText(
                value
        );
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

        return normalizeText(
                value
        );
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

        return normalizeText(
                value
        );
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