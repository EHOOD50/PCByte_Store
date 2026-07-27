package com.asthood.techstore.model;

public enum UserStatus {

    /*
     * Usuario creado durante una compra como invitado.
     *
     * No posee una cuenta activa ni credenciales
     * habilitadas para iniciar sesión.
     */
    INVITADO,

    /*
     * Usuario que completó el formulario de registro,
     * pero todavía no confirmó su correo electrónico.
     */
    PENDIENTE_VERIFICACION,

    /*
     * Usuario con correo verificado y cuenta activa.
     */
    REGISTRADO,

    /*
     * Cuenta deshabilitada para iniciar sesión.
     *
     * Queda preparado para futuros bloqueos
     * administrativos o de seguridad.
     */
    BLOQUEADO
}