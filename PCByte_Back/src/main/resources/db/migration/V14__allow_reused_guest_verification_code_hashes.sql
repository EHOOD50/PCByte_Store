-- ============================================================
-- V14: Permite reutilizar hashes de códigos de verificación
-- ============================================================
--
-- Los tokens largos de verificación prácticamente nunca
-- colisionan, pero los códigos numéricos de 6 dígitos sí pueden
-- repetirse legítimamente con el tiempo.
--
-- Por ese motivo token_hash deja de ser UNIQUE globalmente.
--
-- La seguridad del sistema seguirá garantizada mediante:
--
-- - email;
-- - purpose;
-- - token_hash;
-- - used_at;
-- - invalidated_at;
-- - expiración;
-- - índice único de token activo por correo y propósito.
-- ============================================================

ALTER TABLE verification_tokens
    DROP CONSTRAINT IF EXISTS uk_verification_token_hash;

CREATE INDEX IF NOT EXISTS idx_verification_tokens_token_hash
    ON verification_tokens (
        token_hash
    );