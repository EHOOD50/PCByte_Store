CREATE TABLE email_verification_codes
(
    id BIGSERIAL PRIMARY KEY,

    email VARCHAR(255) NOT NULL,

    code VARCHAR(6) NOT NULL,

    verified BOOLEAN NOT NULL DEFAULT FALSE,

    attempts INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL,

    expires_at TIMESTAMP NOT NULL,

    verified_at TIMESTAMP
);

CREATE INDEX idx_email_verification_email
    ON email_verification_codes(email);

CREATE INDEX idx_email_verification_code
    ON email_verification_codes(code);

CREATE INDEX idx_email_verification_expires
    ON email_verification_codes(expires_at);