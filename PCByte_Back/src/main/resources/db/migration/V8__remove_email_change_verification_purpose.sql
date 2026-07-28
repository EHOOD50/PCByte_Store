-- ============================================================
-- V8: Elimina EMAIL_CHANGE de los propósitos permitidos
-- ============================================================
--
-- En PCByte, el correo electrónico es el identificador
-- principal e inmutable de la cuenta registrada.
--
-- No se permitirá modificarlo desde el perfil del cliente.
-- Un eventual cambio excepcional deberá implementarse como
-- un procedimiento administrativo independiente y auditado.
-- ============================================================

ALTER TABLE verification_tokens
    DROP CONSTRAINT IF EXISTS chk_verification_token_purpose;

ALTER TABLE verification_tokens
    ADD CONSTRAINT chk_verification_token_purpose
        CHECK (
            purpose IN (
                'EMAIL_VERIFICATION',
                'GUEST_CHECKOUT_EMAIL',
                'GUEST_ACCOUNT_CONVERSION',
                'PASSWORD_RESET'
            )
        );