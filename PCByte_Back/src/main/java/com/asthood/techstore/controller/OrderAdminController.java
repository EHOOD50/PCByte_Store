package com.asthood.techstore.controller;

import com.asthood.techstore.dto.OrderResponseDTO;
import com.asthood.techstore.model.OrderStatus;
import com.asthood.techstore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class OrderAdminController {

    private final OrderService orderService;

    // =========================================================
    // LISTAR TODAS LAS ÓRDENES
    // =========================================================

    /*
     * Devuelve las órdenes mediante OrderResponseDTO.
     *
     * Esto evita exponer directamente las entidades JPA
     * y permite entregar al frontend:
     *
     * - datos del cliente;
     * - dirección utilizada en la compra;
     * - subtotal;
     * - costo de despacho;
     * - total;
     * - fotografía de la tarifa de despacho;
     * - productos de la orden.
     */
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        List<OrderResponseDTO> orders =
                orderService.getAllOrders();

        return ResponseEntity.ok(
                orders
        );
    }

    // =========================================================
    // OBTENER UNA ORDEN
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(
            @PathVariable Long id
    ) {
        OrderResponseDTO order =
                orderService.getOrderById(
                        id
                );

        return ResponseEntity.ok(
                order
        );
    }

    // =========================================================
    // ACTUALIZAR ESTADO
    // =========================================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String statusValue =
                body.get(
                        "status"
                );

        if (
                statusValue == null ||
                        statusValue.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El estado de la orden es obligatorio."
            );
        }

        OrderStatus status;

        try {
            status =
                    OrderStatus.valueOf(
                            statusValue
                                    .trim()
                                    .toUpperCase()
                    );
        } catch (
                IllegalArgumentException exception
        ) {
            throw new IllegalArgumentException(
                    "Estado de orden no válido: "
                            + statusValue
            );
        }

        OrderResponseDTO updatedOrder =
                orderService.updateOrderStatus(
                        id,
                        status
                );

        return ResponseEntity.ok(
                updatedOrder
        );
    }
}