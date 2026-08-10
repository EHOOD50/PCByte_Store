-- ============================================================
-- V15: Elimina la infraestructura antigua de códigos
-- ============================================================
--
-- La verificación del checkout invitado fue migrada
-- completamente al sistema VerificationToken.
--
-- La tabla email_verification_codes deja de utilizarse.
-- ============================================================

DROP TABLE IF EXISTS email_verification_codes;