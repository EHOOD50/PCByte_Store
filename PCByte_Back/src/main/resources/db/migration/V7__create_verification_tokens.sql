-- ============================================================
-- V7: Infraestructura del sistema de identidad y verificación
-- ============================================================

-- ------------------------------------------------------------
-- 1. Auditoría y verificación del usuario
-- ------------------------------------------------------------

ALTER TABLE users
    ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE users
    ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE users
    ADD COLUMN email_verified_at TIMESTAMP NULL;

-- Las cuentas que ya estaban registradas antes de implementar
-- este sprint se consideran verificadas.
UPDATE users
SET email_verified_at = CURRENT_TIMESTAMP
WHERE status = 'REGISTRADO'
  AND email_verified_at IS NULL;

-- ------------------------------------------------------------
-- 2. Tabla reutilizable de tokens de verificación
-- ------------------------------------------------------------

CREATE TABLE verification_tokens (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NULL,

    email VARCHAR(255) NOT NULL,

    purpose VARCHAR(50) NOT NULL,

    token_hash VARCHAR(64) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    expires_at TIMESTAMP NOT NULL,

    used_at TIMESTAMP NULL,

    invalidated_at TIMESTAMP NULL,

    request_ip_hash VARCHAR(64) NULL,

    CONSTRAINT uk_verification_token_hash
        UNIQUE (token_hash),

    CONSTRAINT fk_verification_token_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    CONSTRAINT chk_verification_token_expiration
        CHECK (expires_at > created_at),

    CONSTRAINT chk_verification_token_purpose
        CHECK (
            purpose IN (
                'EMAIL_VERIFICATION',
                'GUEST_CHECKOUT_EMAIL',
                'GUEST_ACCOUNT_CONVERSION',
                'PASSWORD_RESET',
                'EMAIL_CHANGE'
            )
        )
);

-- ------------------------------------------------------------
-- 3. Índices de consulta
-- ------------------------------------------------------------

CREATE INDEX idx_verification_tokens_email_purpose
    ON verification_tokens (
        LOWER(email),
        purpose
    );

CREATE INDEX idx_verification_tokens_user_purpose
    ON verification_tokens (
        user_id,
        purpose
    );

CREATE INDEX idx_verification_tokens_expires_at
    ON verification_tokens (
        expires_at
    );

-- Solo puede existir un token activo por correo y propósito.
--
-- Antes de emitir uno nuevo, el servicio invalidará el anterior.
CREATE UNIQUE INDEX uk_verification_tokens_active_email_purpose
    ON verification_tokens (
        LOWER(email),
        purpose
    )
    WHERE used_at IS NULL
      AND invalidated_at IS NULL;