package com.asthood.techstore.service;

import com.asthood.techstore.dto.RegisterRequestDTO;
import com.asthood.techstore.dto.UserAuthResponseDTO;
import com.asthood.techstore.model.Address;
import com.asthood.techstore.model.User;
import com.asthood.techstore.model.UserStatus;
import com.asthood.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserAuthResponseDTO register(
            RegisterRequestDTO request
    ) {
        validateRegisterRequest(request);

        String normalizedEmail = normalizeEmail(
                request.getEmail()
        );

        String firstName = normalizeText(
                request.getFirstName()
        );

        String lastName = normalizeText(
                request.getLastName()
        );

        User user = userRepository
                .findByEmail(normalizedEmail)
                .map(existingUser ->
                        convertGuestToRegistered(
                                existingUser,
                                request,
                                firstName,
                                lastName
                        )
                )
                .orElseGet(() ->
                        createRegisteredUser(
                                request,
                                normalizedEmail,
                                firstName,
                                lastName
                        )
                );

        addMainAddressIfPresent(
                user,
                request
        );

        User savedUser = userRepository.save(user);

        return toResponseDTO(savedUser);
    }

    public UserAuthResponseDTO getAuthenticatedUser(
            String email
    ) {
        String normalizedEmail =
                normalizeEmail(email);

        User user = userRepository
                .findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Usuario no encontrado."
                        )
                );

        if (
                user.getStatus()
                        != UserStatus.REGISTRADO
        ) {
            throw new IllegalArgumentException(
                    "El usuario no tiene una cuenta registrada."
            );
        }

        return toResponseDTO(user);
    }

    private User convertGuestToRegistered(
            User existingUser,
            RegisterRequestDTO request,
            String firstName,
            String lastName
    ) {
        if (
                existingUser.getStatus()
                        == UserStatus.REGISTRADO
        ) {
            throw new IllegalArgumentException(
                    "Este correo ya tiene una cuenta activa."
            );
        }

        existingUser.setFirstName(firstName);
        existingUser.setLastName(lastName);
        existingUser.setPhone(
                normalizeNullableText(
                        request.getPhone()
                )
        );
        existingUser.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );
        existingUser.setStatus(
                UserStatus.REGISTRADO
        );

        if (existingUser.getAddresses() == null) {
            existingUser.setAddresses(
                    new ArrayList<>()
            );
        }

        return existingUser;
    }

    private User createRegisteredUser(
            RegisterRequestDTO request,
            String normalizedEmail,
            String firstName,
            String lastName
    ) {
        return User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(normalizedEmail)
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .phone(
                        normalizeNullableText(
                                request.getPhone()
                        )
                )
                .status(UserStatus.REGISTRADO)
                .addresses(new ArrayList<>())
                .orders(new ArrayList<>())
                .build();
    }

    private void addMainAddressIfPresent(
            User user,
            RegisterRequestDTO request
    ) {
        if (
                request.getStreet() == null
                        || request.getStreet().isBlank()
        ) {
            return;
        }

        if (user.getAddresses() == null) {
            user.setAddresses(
                    new ArrayList<>()
            );
        }

        user.getAddresses().forEach(
                address ->
                        address.setDefault(false)
        );

        Address address = Address.builder()
                .label(
                        request.getAddressLabel() == null
                                || request
                                .getAddressLabel()
                                .isBlank()
                                ? "Principal"
                                : normalizeText(
                                request.getAddressLabel()
                        )
                )
                .street(
                        normalizeText(
                                request.getStreet()
                        )
                )
                .number(
                        normalizeNullableText(
                                request.getNumber()
                        )
                )
                .apartment(
                        normalizeNullableText(
                                request.getApartment()
                        )
                )
                .city(
                        normalizeNullableText(
                                request.getCity()
                        )
                )
                .region(
                        normalizeNullableText(
                                request.getRegion()
                        )
                )
                .extraInfo(
                        normalizeNullableText(
                                request.getExtraInfo()
                        )
                )
                .isDefault(true)
                .user(user)
                .build();

        user.getAddresses().add(address);
    }

    private UserAuthResponseDTO toResponseDTO(
            User user
    ) {
        return UserAuthResponseDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .build();
    }

    private void validateRegisterRequest(
            RegisterRequestDTO request
    ) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Los datos de registro son obligatorios."
            );
        }

        if (
                request.getFirstName() == null
                        || request.getFirstName().isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El nombre es obligatorio."
            );
        }

        if (
                request.getFirstName() == null
                        || request.getFirstName().isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El nombre es obligatorio."
            );
        }

        if (
                request.getLastName() == null
                        || request.getLastName().isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El apellido es obligatorio."
            );
        }

        if (
                request.getEmail() == null
                        || request.getEmail().isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El correo es obligatorio."
            );
        }

        if (
                request.getPassword() == null
                        || request
                        .getPassword()
                        .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "La contraseña es obligatoria."
            );
        }

        if (
                request.getPassword().length() < 8
                        || request
                        .getPassword()
                        .length() > 72
        ) {
            throw new IllegalArgumentException(
                    "La contraseña debe contener entre 8 y 72 caracteres."
            );
        }
    }

    private String normalizeEmail(
            String email
    ) {
        return email
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    private String normalizeText(
            String value
    ) {
        return value
                .trim()
                .replaceAll("\\s+", " ");
    }

    private String normalizeNullableText(
            String value
    ) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return normalizeText(value);
    }



}