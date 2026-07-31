package com.asthood.techstore.util;

public final class PhoneNumberUtils {

    private static final String CHILE_COUNTRY_CODE = "56";

    private PhoneNumberUtils() {
        // Evita instanciar esta clase de utilidad.
    }

    /**
     * Valida números telefónicos chilenos móviles y fijos.
     *
     * Formatos aceptados, por ejemplo:
     *
     * +56 9 1234 5678
     * 56912345678
     * 9 1234 5678
     * 912345678
     *
     * +56 2 2345 6789
     * 56223456789
     * 2 2345 6789
     * 223456789
     *
     * También admite espacios, guiones y paréntesis.
     */
    public static boolean isValid(String phone) {
        if (phone == null || phone.isBlank()) {
            return true;
        }

        String normalized = normalize(phone);

        if (normalized == null) {
            return false;
        }

        return normalized.matches("^\\+56\\d{9}$");
    }

    /**
     * Normaliza un teléfono chileno al formato internacional E.164:
     *
     * +56912345678
     * +56223456789
     *
     * Retorna null si el valor no puede normalizarse.
     */
    public static String normalize(String phone) {
        if (phone == null || phone.isBlank()) {
            return null;
        }

        String digits = phone.replaceAll("\\D", "");

        if (digits.startsWith(CHILE_COUNTRY_CODE)) {
            digits = digits.substring(CHILE_COUNTRY_CODE.length());
        }

        if (digits.length() != 9) {
            return null;
        }

        return "+" + CHILE_COUNTRY_CODE + digits;
    }

    /**
     * Entrega una representación legible del teléfono.
     *
     * Ejemplos:
     *
     * +56912345678 -> +56 9 1234 5678
     * +56223456789 -> +56 2 2345 6789
     */
    public static String format(String phone) {
        String normalized = normalize(phone);

        if (normalized == null) {
            return phone;
        }

        String nationalNumber = normalized.substring(3);

        return "+56 "
                + nationalNumber.charAt(0)
                + " "
                + nationalNumber.substring(1, 5)
                + " "
                + nationalNumber.substring(5);
    }
}