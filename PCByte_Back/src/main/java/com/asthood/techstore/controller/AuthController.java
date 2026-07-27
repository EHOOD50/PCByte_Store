package com.asthood.techstore.controller;

import com.asthood.techstore.dto.ChangePasswordDTO;
import com.asthood.techstore.dto.RegisterRequestDTO;
import com.asthood.techstore.dto.UpdateProfileDTO;
import com.asthood.techstore.dto.UserAuthResponseDTO;
import com.asthood.techstore.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserAuthResponseDTO> login(
            Authentication authentication
    ) {
        UserAuthResponseDTO response =
                authService.getAuthenticatedUser(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserAuthResponseDTO> register(
            @Valid
            @RequestBody
            RegisterRequestDTO request
    ) {
        UserAuthResponseDTO response =
                authService.register(request);

        return ResponseEntity.ok(response);
    }

    /*
     * Obtiene los datos del usuario autenticado.
     */
    @GetMapping("/profile")
    public ResponseEntity<UserAuthResponseDTO> getProfile(
            Authentication authentication
    ) {
        UserAuthResponseDTO response =
                authService.getAuthenticatedUser(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    /*
     * Actualiza nombre, apellido y teléfono.
     */
    @PutMapping("/profile")
    public ResponseEntity<UserAuthResponseDTO> updateProfile(
            Authentication authentication,

            @Valid
            @RequestBody
            UpdateProfileDTO request
    ) {
        UserAuthResponseDTO response =
                authService.updateProfile(
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    /*
     * Cambia la contraseña del usuario autenticado.
     */
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,

            @Valid
            @RequestBody
            ChangePasswordDTO request
    ) {
        authService.changePassword(
                authentication.getName(),
                request
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}