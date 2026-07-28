package com.asthood.techstore.controller;

import com.asthood.techstore.dto.ChangePasswordDTO;
import com.asthood.techstore.dto.EmailVerificationResponseDTO;
import com.asthood.techstore.dto.RegisterRequestDTO;
import com.asthood.techstore.dto.ResendVerificationRequestDTO;
import com.asthood.techstore.dto.UpdateProfileDTO;
import com.asthood.techstore.dto.UserAuthResponseDTO;
import com.asthood.techstore.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    /*
     * Inicia sesión con una cuenta registrada
     * y con correo verificado.
     */
    @PostMapping("/login")
    public ResponseEntity<UserAuthResponseDTO> login(
            Authentication authentication
    ) {
        UserAuthResponseDTO response =
                authService.getAuthenticatedUser(
                        authentication.getName()
                );

        return ResponseEntity.ok(
                response
        );
    }

    /*
     * Crea una cuenta pendiente de verificación
     * o vuelve a emitir el enlace para una cuenta
     * que todavía no ha sido activada.
     */
    @PostMapping("/register")
    public ResponseEntity<UserAuthResponseDTO> register(
            @Valid
            @RequestBody
            RegisterRequestDTO request,

            HttpServletRequest httpRequest
    ) {
        UserAuthResponseDTO response =
                authService.register(
                        request,
                        resolveClientIp(
                                httpRequest
                        )
                );

        return ResponseEntity.ok(
                response
        );
    }

    /*
     * Verifica el correo y activa la cuenta.
     */
    @GetMapping("/verify-email")
    public ResponseEntity<EmailVerificationResponseDTO>
    verifyEmail(
            @RequestParam("token")
            String token
    ) {
        EmailVerificationResponseDTO response =
                authService.verifyEmail(
                        token
                );

        return ResponseEntity.ok(
                response
        );
    }

    /*
     * Solicita un nuevo correo de verificación.
     *
     * La respuesta siempre es genérica para no revelar
     * si el correo existe, está activo o está pendiente.
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<EmailVerificationResponseDTO>
    resendVerification(
            @Valid
            @RequestBody
            ResendVerificationRequestDTO request,

            HttpServletRequest httpRequest
    ) {
        authService.resendVerification(
                request.getEmail(),
                resolveClientIp(
                        httpRequest
                )
        );

        EmailVerificationResponseDTO response =
                EmailVerificationResponseDTO
                        .builder()
                        .verified(false)
                        .message(
                                "Si existe una cuenta pendiente para ese correo, enviaremos un nuevo enlace de verificación."
                        )
                        .status(null)
                        .build();

        return ResponseEntity.ok(
                response
        );
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

        return ResponseEntity.ok(
                response
        );
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

        return ResponseEntity.ok(
                response
        );
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

    /*
     * Obtiene la IP del cliente considerando proxies
     * reversos como ngrok.
     *
     * El servicio de tokens almacenará solamente su hash.
     */
    private String resolveClientIp(
            HttpServletRequest request
    ) {
        String forwardedFor =
                request.getHeader(
                        "X-Forwarded-For"
                );

        if (
                forwardedFor != null &&
                        !forwardedFor.isBlank()
        ) {
            return forwardedFor
                    .split(",")[0]
                    .trim();
        }

        String realIp =
                request.getHeader(
                        "X-Real-IP"
                );

        if (
                realIp != null &&
                        !realIp.isBlank()
        ) {
            return realIp.trim();
        }

        return request.getRemoteAddr();
    }
}