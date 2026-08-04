package com.asthood.techstore.dto;

import com.asthood.techstore.model.UserRole;
import com.asthood.techstore.model.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
 * Resumen de un usuario para la administración.
 *
 * Este DTO está diseñado exclusivamente para el
 * listado del panel administrativo.
 *
 * No contiene información sensible como la contraseña.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserListDTO {

    /*
     * Identificador único.
     */
    private Long id;

    /*
     * Datos personales.
     */
    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    /*
     * Rol dentro del sistema.
     */
    private UserRole role;

    /*
     * Estado actual de la cuenta.
     */
    private UserStatus status;

    /*
     * Indica si el correo fue verificado.
     */
    private boolean emailVerified;

    /*
     * Fecha de creación de la cuenta.
     */
    private LocalDateTime createdAt;

    /*
     * Última modificación del perfil.
     */
    private LocalDateTime updatedAt;

    /*
     * Información resumida utilizada por
     * el Dashboard.
     */
    private int orderCount;

    private int addressCount;
}