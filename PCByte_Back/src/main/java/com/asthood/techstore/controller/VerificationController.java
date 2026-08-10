package com.asthood.techstore.controller;

import com.asthood.techstore.dto.SendVerificationCodeRequestDTO;
import com.asthood.techstore.dto.VerificationCodeResponseDTO;
import com.asthood.techstore.dto.VerifyVerificationCodeRequestDTO;
import com.asthood.techstore.model.VerificationPurpose;
import com.asthood.techstore.service.identity.IssuedVerificationToken;
import com.asthood.techstore.service.identity.VerificationTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VerificationController {

    private final VerificationTokenService
            verificationTokenService;

    /*
     * Genera un nuevo código para el checkout invitado.
     *
     * El envío del correo continúa realizándose mediante
     * el evento AFTER_COMMIT del sistema de identidad.
     */
    @PostMapping("/send-code")
    public ResponseEntity<VerificationCodeResponseDTO>
    sendCode(

            @Valid
            @RequestBody
            SendVerificationCodeRequestDTO request,

            HttpServletRequest httpRequest

    ) {

        IssuedVerificationToken issuedToken =
                verificationTokenService
                        .issueGuestToken(
                                request.email(),
                                VerificationPurpose
                                        .GUEST_CHECKOUT_EMAIL,
                                resolveClientIp(
                                        httpRequest
                                )
                        );

        VerificationCodeResponseDTO response =
                VerificationCodeResponseDTO
                        .builder()
                        .verified(false)
                        .message(
                                "Se envió un código de verificación al correo indicado."
                        )
                        .build();

        return ResponseEntity.ok(
                response
        );
    }

    /*
     * Verifica el código ingresado por el usuario.
     */
    @PostMapping("/verify-code")
    public ResponseEntity<VerificationCodeResponseDTO>
    verifyCode(

            @Valid
            @RequestBody
            VerifyVerificationCodeRequestDTO request

    ) {

        verificationTokenService
                .consumeGuestCheckoutCode(
                        request.email(),
                        request.code()
                );

        VerificationCodeResponseDTO response =
                VerificationCodeResponseDTO
                        .builder()
                        .verified(true)
                        .message(
                                "Correo verificado correctamente."
                        )
                        .build();

        return ResponseEntity.ok(
                response
        );
    }

    /*
     * Obtiene la IP del cliente considerando proxies
     * como ngrok o futuros balanceadores.
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