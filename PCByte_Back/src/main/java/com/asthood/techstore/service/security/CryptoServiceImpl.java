package com.asthood.techstore.service.security;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class CryptoServiceImpl
        implements CryptoService {

    /*
     * 32 bytes aleatorios equivalen a 256 bits
     * de entropía antes de codificar.
     */
    private static final int TOKEN_BYTE_LENGTH =
            32;

    private static final String HASH_ALGORITHM =
            "SHA-256";

    private final SecureRandom secureRandom;

    public CryptoServiceImpl() {
        this.secureRandom =
                new SecureRandom();
    }

    @Override
    public String generateSecureToken() {
        byte[] randomBytes =
                new byte[
                        TOKEN_BYTE_LENGTH
                        ];

        secureRandom.nextBytes(
                randomBytes
        );

        return Base64
                .getUrlEncoder()
                .withoutPadding()
                .encodeToString(
                        randomBytes
                );
    }

    @Override
    public String sha256(
            String value
    ) {
        if (
                value == null ||
                        value.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El valor a procesar no puede estar vacío."
            );
        }

        MessageDigest messageDigest =
                createMessageDigest();

        byte[] hashBytes =
                messageDigest.digest(
                        value.getBytes(
                                StandardCharsets.UTF_8
                        )
                );

        return HexFormat
                .of()
                .formatHex(
                        hashBytes
                );
    }

    @Override
    public boolean matchesSha256(
            String rawValue,
            String expectedHash
    ) {
        if (
                rawValue == null ||
                        rawValue.isBlank() ||
                        expectedHash == null ||
                        expectedHash.isBlank()
        ) {
            return false;
        }

        String calculatedHash =
                sha256(
                        rawValue
                );

        byte[] calculatedBytes =
                calculatedHash.getBytes(
                        StandardCharsets.UTF_8
                );

        byte[] expectedBytes =
                expectedHash
                        .trim()
                        .toLowerCase()
                        .getBytes(
                                StandardCharsets.UTF_8
                        );

        return MessageDigest.isEqual(
                calculatedBytes,
                expectedBytes
        );
    }

    private MessageDigest createMessageDigest() {
        try {
            return MessageDigest.getInstance(
                    HASH_ALGORITHM
            );
        } catch (
                NoSuchAlgorithmException exception
        ) {
            /*
             * SHA-256 forma parte obligatoria de la JVM.
             * Si no estuviera disponible, la aplicación
             * no puede continuar de forma segura.
             */
            throw new IllegalStateException(
                    "SHA-256 no está disponible en la JVM.",
                    exception
            );
        }
    }
}