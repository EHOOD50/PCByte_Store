package com.asthood.techstore.controller;

import com.asthood.techstore.model.GlobalConfig;
import com.asthood.techstore.repository.GlobalConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/config")
@RequiredArgsConstructor // Lombok inyecta el repositorio automáticamente
@CrossOrigin(origins = "*") // Permite acceso desde tu React
public class ConfigController {

    private final GlobalConfigRepository repository;

    // Obtener el menú para los clientes
    @GetMapping("/menu")
    public ResponseEntity<GlobalConfig> getMenu() {
        return repository.findById("MAIN_MENU")
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Guardar el menú desde el Admin
    @PostMapping("/menu")
    public ResponseEntity<GlobalConfig> saveMenu(@RequestBody GlobalConfig config) {
        config.setConfigKey("MAIN_MENU"); // Forzamos que siempre sea el menú principal
        return ResponseEntity.ok(repository.save(config));
    }
}
