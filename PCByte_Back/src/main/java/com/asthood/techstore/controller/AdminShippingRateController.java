package com.asthood.techstore.controller;

import com.asthood.techstore.dto.ShippingRateDTO;
import com.asthood.techstore.service.ShippingRateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/admin/shipping-rates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminShippingRateController {

    private final ShippingRateService shippingRateService;

    // =========================================================
    // LISTAR TODAS LAS TARIFAS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<ShippingRateDTO>> findAll() {
        return ResponseEntity.ok(
                shippingRateService.findAll()
        );
    }

    // =========================================================
    // OBTENER UNA TARIFA
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<ShippingRateDTO> findById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                shippingRateService.findById(id)
        );
    }

    // =========================================================
    // CREAR TARIFA
    // =========================================================

    @PostMapping
    public ResponseEntity<ShippingRateDTO> create(
            @RequestBody ShippingRateDTO request
    ) {
        ShippingRateDTO createdRate =
                shippingRateService.create(request);

        return ResponseEntity
                .created(
                        URI.create(
                                "/api/admin/shipping-rates/"
                                        + createdRate.getId()
                        )
                )
                .body(createdRate);
    }

    // =========================================================
    // ACTUALIZAR TARIFA
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<ShippingRateDTO> update(
            @PathVariable Long id,
            @RequestBody ShippingRateDTO request
    ) {
        return ResponseEntity.ok(
                shippingRateService.update(
                        id,
                        request
                )
        );
    }

    // =========================================================
    // ACTIVAR O DESACTIVAR
    // =========================================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<ShippingRateDTO> changeStatus(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {
        return ResponseEntity.ok(
                shippingRateService.changeStatus(
                        id,
                        active
                )
        );
    }

    // =========================================================
    // ELIMINAR TARIFA
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        shippingRateService.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}