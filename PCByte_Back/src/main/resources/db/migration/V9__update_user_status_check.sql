ALTER TABLE users
DROP CONSTRAINT users_status_check;

ALTER TABLE users
ADD CONSTRAINT users_status_check
CHECK (
    status IN (
        'INVITADO',
        'EMAIL_PENDIENTE_VERIFICACION',
        'REGISTRADO',
        'BLOQUEADO'
    )
);