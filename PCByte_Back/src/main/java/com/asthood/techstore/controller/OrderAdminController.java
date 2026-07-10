package com.asthood.techstore.controller;

import com.asthood.techstore.model.Order;
import com.asthood.techstore.model.OrderStatus;
import com.asthood.techstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "*")
public class OrderAdminController { // 👈 Cambié el ";" por "{"

    @Autowired
    private OrderRepository orderRepository;

    // Listar todas las órdenes para la tabla de "Logística"
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Actualizar el estado de la orden desde el selector de la tabla
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return orderRepository.findById(id).map(order -> {
            try {
                String statusStr = body.get("status");

                // Intentamos convertir el String a Enum.
                // Si tu campo 'status' en la clase Order es String,
                // cambia la línea de abajo por: order.setStatus(statusStr);
                order.setStatus(OrderStatus.valueOf(statusStr));

                orderRepository.save(order);
                return ResponseEntity.ok().build();
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Error al actualizar estado: " + e.getMessage());
            }
        }).orElse(ResponseEntity.notFound().build());
    }
} // 👈 Asegúrate de que esta llave de cierre esté al final