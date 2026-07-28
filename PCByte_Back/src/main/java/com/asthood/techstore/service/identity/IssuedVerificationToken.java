package com.asthood.techstore.service.identity;

import com.asthood.techstore.model.VerificationPurpose;

import java.time.LocalDateTime;

/*
 * Resultado seguro de la emisión de un token.
 *
 * rawToken es el único valor que se envía al cliente.
 * La base de datos conserva exclusivamente su hash.
 */
public record IssuedVerificationToken(
        String rawToken,
        String email,
        VerificationPurpose purpose,
        LocalDateTime expiresAt
) {
}