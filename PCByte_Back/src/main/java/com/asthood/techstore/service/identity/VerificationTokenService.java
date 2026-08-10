package com.asthood.techstore.service.identity;

import com.asthood.techstore.config.VerificationProperties;
import com.asthood.techstore.event.GuestVerificationCodeRequestedEvent;
import com.asthood.techstore.exception.VerificationTokenErrorCode;
import com.asthood.techstore.exception.VerificationTokenException;
import com.asthood.techstore.model.User;
import com.asthood.techstore.model.VerificationPurpose;
import com.asthood.techstore.model.VerificationToken;
import com.asthood.techstore.repository.VerificationTokenRepository;
import com.asthood.techstore.service.security.CryptoService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class VerificationTokenService {

    private static final int GUEST_CODE_DIGITS =
            6;

    private final VerificationTokenRepository
            verificationTokenRepository;

    private final CryptoService cryptoService;

    private final VerificationProperties
            verificationProperties;

    private final Clock applicationClock;

    private final ApplicationEventPublisher
            eventPublisher;

    /*
     * Emite un nuevo token para una operación vinculada
     * a un usuario.
     */
    @Transactional
    public IssuedVerificationToken issueToken(
            User user,
            String email,
            VerificationPurpose purpose,
            String requestIp
    ) {
        String normalizedEmail =
                normalizeEmail(
                        email
                );

        validatePurpose(
                purpose
        );

        validateUserEmail(
                user,
                normalizedEmail
        );

        LocalDateTime now =
                now();

        enforceRateLimit(
                normalizedEmail,
                purpose,
                now
        );

        invalidateActiveTokens(
                normalizedEmail,
                purpose,
                now
        );

        String rawToken =
                cryptoService
                        .generateSecureToken();

        String tokenHash =
                cryptoService
                        .sha256(
                                rawToken
                        );

        LocalDateTime expiresAt =
                calculateExpiration(
                        purpose,
                        now
                );

        VerificationToken token =
                VerificationToken
                        .builder()
                        .user(
                                user
                        )
                        .email(
                                normalizedEmail
                        )
                        .purpose(
                                purpose
                        )
                        .tokenHash(
                                tokenHash
                        )
                        .createdAt(
                                now
                        )
                        .expiresAt(
                                expiresAt
                        )
                        .requestIpHash(
                                hashOptionalValue(
                                        requestIp
                                )
                        )
                        .build();

        verificationTokenRepository
                .save(
                        token
                );

        return new IssuedVerificationToken(
                rawToken,
                normalizedEmail,
                purpose,
                expiresAt
        );
    }

    /*
     * Emite un código numérico sin usuario asociado
     * para verificar el correo durante el checkout invitado.
     *
     * PostgreSQL conserva solamente el hash SHA-256.
     * El código original permanece únicamente en memoria
     * y se entrega al listener encargado del correo.
     */
    @Transactional
    public IssuedVerificationToken issueGuestToken(
            String email,
            VerificationPurpose purpose,
            String requestIp
    ) {
        if (
                purpose !=
                        VerificationPurpose
                                .GUEST_CHECKOUT_EMAIL
        ) {
            throw new IllegalArgumentException(
                    "El propósito indicado no corresponde a una verificación de checkout invitado."
            );
        }

        String normalizedEmail =
                normalizeEmail(
                        email
                );

        LocalDateTime now =
                now();

        enforceRateLimit(
                normalizedEmail,
                purpose,
                now
        );

        invalidateActiveTokens(
                normalizedEmail,
                purpose,
                now
        );

        String rawCode =
                cryptoService
                        .generateNumericCode(
                                GUEST_CODE_DIGITS
                        );

        LocalDateTime expiresAt =
                calculateExpiration(
                        purpose,
                        now
                );

        VerificationToken token =
                VerificationToken
                        .builder()
                        .user(
                                null
                        )
                        .email(
                                normalizedEmail
                        )
                        .purpose(
                                purpose
                        )
                        .tokenHash(
                                cryptoService
                                        .sha256(
                                                rawCode
                                        )
                        )
                        .createdAt(
                                now
                        )
                        .expiresAt(
                                expiresAt
                        )
                        .requestIpHash(
                                hashOptionalValue(
                                        requestIp
                                )
                        )
                        .build();

        verificationTokenRepository
                .save(
                        token
                );

        /*
         * El listener procesará este evento únicamente
         * después de que la transacción finalice con éxito.
         */
        eventPublisher.publishEvent(
                new GuestVerificationCodeRequestedEvent(
                        normalizedEmail,
                        rawCode,
                        expiresAt
                )
        );

        return new IssuedVerificationToken(
                rawCode,
                normalizedEmail,
                purpose,
                expiresAt
        );
    }

    /*
     * Valida y consume atómicamente un token largo.
     */
    @Transactional
    public VerificationToken consumeToken(
            String rawToken,
            VerificationPurpose expectedPurpose
    ) {
        validateRawToken(
                rawToken
        );

        validatePurpose(
                expectedPurpose
        );

        String tokenHash =
                cryptoService
                        .sha256(
                                rawToken
                        );

        VerificationToken token =
                verificationTokenRepository
                        .findByTokenHash(
                                tokenHash
                        )
                        .orElseThrow(
                                () ->
                                        new VerificationTokenException(
                                                VerificationTokenErrorCode
                                                        .TOKEN_INVALID
                                        )
                        );

        validateTokenState(
                token,
                expectedPurpose
        );

        token.setUsedAt(
                now()
        );

        return verificationTokenRepository
                .save(
                        token
                );
    }

    /*
     * Valida y consume un código numérico utilizado
     * durante el checkout invitado.
     *
     * La búsqueda utiliza correo, propósito y hash
     * para evitar que un código pueda utilizarse
     * sobre el correo de otra persona.
     */
    @Transactional
    public VerificationToken consumeGuestCheckoutCode(
            String email,
            String rawCode
    ) {
        String normalizedEmail =
                normalizeEmail(
                        email
                );

        validateGuestCode(
                rawCode
        );

        String tokenHash =
                cryptoService
                        .sha256(
                                rawCode.trim()
                        );

        VerificationToken token =
                verificationTokenRepository
                        .findFirstByEmailIgnoreCaseAndPurposeAndTokenHashAndUsedAtIsNullAndInvalidatedAtIsNullOrderByCreatedAtDesc(
                                normalizedEmail,
                                VerificationPurpose
                                        .GUEST_CHECKOUT_EMAIL,
                                tokenHash
                        )
                        .orElseThrow(
                                () ->
                                        new VerificationTokenException(
                                                VerificationTokenErrorCode
                                                        .VERIFICATION_CODE_INVALID
                                        )
                        );

        if (
                token.isExpired()
        ) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .VERIFICATION_CODE_EXPIRED
            );
        }

        token.setUsedAt(
                now()
        );

        return verificationTokenRepository
                .save(
                        token
                );
    }

    /*
     * Invalida explícitamente todos los tokens pendientes
     * de un correo y propósito.
     */
    @Transactional
    public void invalidateTokens(
            String email,
            VerificationPurpose purpose
    ) {
        String normalizedEmail =
                normalizeEmail(
                        email
                );

        validatePurpose(
                purpose
        );

        invalidateActiveTokens(
                normalizedEmail,
                purpose,
                now()
        );
    }

    /*
     * Valida propósito, uso, invalidación y vencimiento.
     */
    private void validateTokenState(
            VerificationToken token,
            VerificationPurpose expectedPurpose
    ) {
        if (
                token.getPurpose() !=
                        expectedPurpose
        ) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .TOKEN_PURPOSE_MISMATCH
            );
        }

        if (
                token.getUsedAt() != null
        ) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .TOKEN_ALREADY_USED
            );
        }

        if (
                token.getInvalidatedAt() != null
        ) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .TOKEN_INVALIDATED
            );
        }

        if (
                !token.getExpiresAt()
                        .isAfter(
                                now()
                        )
        ) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .TOKEN_EXPIRED
            );
        }
    }

    /*
     * Aplica:
     *
     * - tiempo mínimo entre reenvíos;
     * - máximo de solicitudes durante la última hora.
     */
    private void enforceRateLimit(
            String email,
            VerificationPurpose purpose,
            LocalDateTime now
    ) {
        verificationTokenRepository
                .findTopByEmailIgnoreCaseAndPurposeOrderByCreatedAtDesc(
                        email,
                        purpose
                )
                .ifPresent(
                        latestToken -> {
                            LocalDateTime nextAllowedAt =
                                    latestToken
                                            .getCreatedAt()
                                            .plusSeconds(
                                                    verificationProperties
                                                            .getResendCooldownSeconds()
                                            );

                            if (
                                    now.isBefore(
                                            nextAllowedAt
                                    )
                            ) {
                                long remainingSeconds =
                                        java.time.Duration
                                                .between(
                                                        now,
                                                        nextAllowedAt
                                                )
                                                .getSeconds();

                                throw new VerificationTokenException(
                                        VerificationTokenErrorCode
                                                .TOO_MANY_REQUESTS,
                                        "Espera " +
                                                Math.max(
                                                        remainingSeconds,
                                                        1
                                                ) +
                                                " segundos antes de solicitar otro envío."
                                );
                            }
                        }
                );

        LocalDateTime oneHourAgo =
                now.minusHours(
                        1
                );

        long recentRequestCount =
                verificationTokenRepository
                        .countByEmailIgnoreCaseAndPurposeAndCreatedAtAfter(
                                email,
                                purpose,
                                oneHourAgo
                        );

        if (
                recentRequestCount >=
                        verificationProperties
                                .getMaxRequestsPerHour()
        ) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .TOO_MANY_REQUESTS,
                    "Se alcanzó el límite de solicitudes para este correo. Inténtalo nuevamente más tarde."
            );
        }
    }

    /*
     * Invalida tokens anteriores y fuerza el flush antes
     * de insertar uno nuevo.
     */
    private void invalidateActiveTokens(
            String email,
            VerificationPurpose purpose,
            LocalDateTime invalidatedAt
    ) {
        List<VerificationToken> activeTokens =
                verificationTokenRepository
                        .findAllByEmailIgnoreCaseAndPurposeAndUsedAtIsNullAndInvalidatedAtIsNull(
                                email,
                                purpose
                        );

        if (
                activeTokens.isEmpty()
        ) {
            return;
        }

        activeTokens.forEach(
                token -> {
                    if (
                            token.getInvalidatedAt() == null &&
                                    token.getUsedAt() == null
                    ) {
                        token.setInvalidatedAt(
                                invalidatedAt
                        );
                    }
                }
        );

        verificationTokenRepository
                .saveAll(
                        activeTokens
                );

        verificationTokenRepository
                .flush();
    }

    private LocalDateTime calculateExpiration(
            VerificationPurpose purpose,
            LocalDateTime createdAt
    ) {
        return switch (purpose) {

            case EMAIL_VERIFICATION ->
                    createdAt.plusHours(
                            verificationProperties
                                    .getEmailVerificationExpirationHours()
                    );

            case GUEST_CHECKOUT_EMAIL ->
                    createdAt.plusMinutes(
                            verificationProperties
                                    .getGuestCheckoutExpirationMinutes()
                    );

            case GUEST_ACCOUNT_CONVERSION ->
                    createdAt.plusHours(
                            verificationProperties
                                    .getGuestAccountConversionExpirationHours()
                    );

            case PASSWORD_RESET ->
                    createdAt.plusMinutes(
                            verificationProperties
                                    .getPasswordResetExpirationMinutes()
                    );
        };
    }

    private void validateUserEmail(
            User user,
            String normalizedEmail
    ) {
        if (
                user == null ||
                        user.getId() == null
        ) {
            throw new IllegalArgumentException(
                    "El usuario asociado al token es obligatorio."
            );
        }

        String userEmail =
                normalizeEmail(
                        user.getEmail()
                );

        if (
                !userEmail.equals(
                        normalizedEmail
                )
        ) {
            throw new IllegalArgumentException(
                    "El correo no coincide con el usuario asociado."
            );
        }
    }

    private void validateRawToken(
            String rawToken
    ) {
        if (
                rawToken == null ||
                        rawToken.isBlank()
        ) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .TOKEN_INVALID
            );
        }
    }

    private void validateGuestCode(
            String rawCode
    ) {
        if (
                rawCode == null ||
                        !rawCode
                                .trim()
                                .matches(
                                        "\\d{6}"
                                )
        ) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .VERIFICATION_CODE_INVALID
            );
        }
    }

    private void validatePurpose(
            VerificationPurpose purpose
    ) {
        if (
                purpose == null
        ) {
            throw new IllegalArgumentException(
                    "El propósito del token es obligatorio."
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
                    "El correo es obligatorio."
            );
        }

        return email
                .trim()
                .toLowerCase(
                        Locale.ROOT
                );
    }

    private String hashOptionalValue(
            String value
    ) {
        if (
                value == null ||
                        value.isBlank()
        ) {
            return null;
        }

        return cryptoService
                .sha256(
                        value.trim()
                );
    }

    private LocalDateTime now() {
        return LocalDateTime.now(
                applicationClock
        );
    }
}