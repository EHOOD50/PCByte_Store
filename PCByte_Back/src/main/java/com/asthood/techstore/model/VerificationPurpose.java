package com.asthood.techstore.model;

/*
 * Define el propósito exclusivo para el cual
 * fue emitido un token.
 *
 * Un token nunca debe aceptarse para una finalidad
 * diferente de aquella con la que fue creado.
 */
public enum VerificationPurpose {

    /*
     * Activa una cuenta creada mediante
     * el formulario de registro.
     */
    EMAIL_VERIFICATION,

    /*
     * Comprueba el correo utilizado durante
     * una compra como invitado.
     *
     * Esta verificación se asocia a la sesión
     * específica de checkout.
     */
    GUEST_CHECKOUT_EMAIL,

    /*
     * Confirma la conversión posterior de un
     * cliente invitado en cliente registrado.
     *
     * Se utiliza cuando la conversión no ocurre
     * inmediatamente dentro de la misma sesión
     * de checkout ya verificada.
     */
    GUEST_ACCOUNT_CONVERSION,

    /*
     * Comprueba el control del correo antes
     * de permitir restablecer una contraseña.
     */
    PASSWORD_RESET
}