package com.asthood.techstore.controller;

import com.asthood.techstore.dto.RegisterRequestDTO;
import com.asthood.techstore.dto.UserAuthResponseDTO;
import com.asthood.techstore.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
            @Valid @RequestBody RegisterRequestDTO request
    ) {

        UserAuthResponseDTO response =
                authService.register(request);

        return ResponseEntity.ok(response);
    }
}