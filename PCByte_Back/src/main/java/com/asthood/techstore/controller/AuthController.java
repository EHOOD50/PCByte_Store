package com.asthood.techstore.controller;

import com.asthood.techstore.model.User;
import com.asthood.techstore.model.UserStatus;
import com.asthood.techstore.model.Address;
import com.asthood.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(Authentication authentication) {
        // Spring Security ya validó las credenciales antes de llegar aquí
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerOrUpdate(@RequestBody RegisterRequest request) {
        // 1. Buscar si el email ya existe (como Invitado o Registrado)
        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());
        User userToSave;

        // Lógica para separar el nombre completo que viene del Frontend
        String fullInputName = request.getName() != null ? request.getName().trim() : "";
        String fName = "";
        String lName = "";

        if (!fullInputName.isEmpty()) {
            String[] parts = fullInputName.split(" ", 2);
            fName = parts[0];
            lName = (parts.length > 1) ? parts[1] : "";
        }

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            // Si ya es REGISTRADO, no puede volver a registrarse
            if (existingUser.getStatus() == UserStatus.REGISTRADO) {
                return ResponseEntity.badRequest().body("Este email ya tiene una cuenta activa.");
            }

            // CONVERSIÓN: De Invitado a Registrado
            existingUser.setFirstName(fName);
            existingUser.setLastName(lName);
            existingUser.setPassword(request.getPassword()); // TODO: passwordEncoder.encode(request.getPassword())
            existingUser.setStatus(UserStatus.REGISTRADO);
            userToSave = existingUser;
        } else {
            // CREACIÓN: Usuario nuevo desde cero
            userToSave = User.builder()
                    .firstName(fName)
                    .lastName(lName)
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .status(UserStatus.REGISTRADO)
                    .addresses(new ArrayList<>())
                    .build();
        }

        // 2. Manejo de la dirección vinculada (user_addresses)
        if (request.getStreet() != null && !request.getStreet().isEmpty()) {
            Address newAddress = Address.builder()
                    .label("Principal")
                    .street(request.getStreet())
                    .number(request.getNumber())
                    .city(request.getCity())
                    .region(request.getRegion())
                    .isDefault(true)
                    .user(userToSave)
                    .build();

            // Inicializar lista si es nula para evitar NullPointerException
            if (userToSave.getAddresses() == null) {
                userToSave.setAddresses(new ArrayList<>());
            }
            userToSave.getAddresses().add(newAddress);
        }

        // 3. Guardar todo (Gracias al CascadeType.ALL en User, guarda también la Address)
        return ResponseEntity.ok(userRepository.save(userToSave));
    }
}

/**
 * DTO para capturar los datos del JSON enviado desde React
 */
@Data
class RegisterRequest {
    private String name;     // "Juan Pérez" -> Se divide en firstName y lastName en el controller
    private String email;
    private String password;
    private String street;
    private String number;
    private String city;
    private String region;
}