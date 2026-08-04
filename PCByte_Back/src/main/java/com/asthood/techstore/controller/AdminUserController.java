package com.asthood.techstore.controller;

import com.asthood.techstore.dto.AdminUpdateUserStatusDTO;
import com.asthood.techstore.dto.AdminUserListDTO;
import com.asthood.techstore.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * Endpoints administrativos para la gestión de usuarios.
 *
 * Todas las rutas de este controlador quedan protegidas
 * mediante ROLE_ADMIN desde SecurityConfig.
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    /*
     * Obtiene el listado resumido de usuarios.
     */
    @GetMapping
    public ResponseEntity<List<AdminUserListDTO>> getUsers() {

        return ResponseEntity.ok(
                adminUserService.getUsers()
        );
    }

    /*
     * Actualiza el estado de un usuario.
     */
    @PatchMapping("/{userId}/status")
    public ResponseEntity<AdminUserListDTO> updateStatus(
            @PathVariable Long userId,
            @Valid
            @RequestBody AdminUpdateUserStatusDTO request
    ) {

        return ResponseEntity.ok(
                adminUserService.updateStatus(
                        userId,
                        request.getStatus()
                )
        );
    }
}