package com.asthood.techstore.service.security;

/*
 * Servicio criptográfico central de PCByte.
 *
 * Toda generación de secretos y todo hash de tokens
 * debe pasar por esta interfaz.
 */
public interface CryptoService {

    /*
     * Genera un token criptográficamente seguro,
     * codificado en Base64 URL Safe y sin padding.
     */
    String generateSecureToken();

    /*
     * Calcula el hash SHA-256 de un valor y lo devuelve
     * como una cadena hexadecimal de 64 caracteres.
     */
    String sha256(
            String value
    );

    /*
     * Compara un valor original con un hash SHA-256
     * esperado.
     */
    boolean matchesSha256(
            String rawValue,
            String expectedHash
    );
}