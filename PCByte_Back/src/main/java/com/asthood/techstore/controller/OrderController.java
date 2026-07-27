package com.asthood.techstore.controller;

import com.asthood.techstore.dto.OrderResponseDTO;
import com.asthood.techstore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    // ============================
    // PEDIDOS DEL CLIENTE
    // ============================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponseDTO>>
    getOrdersByUser(
            @PathVariable Long userId
    ) {
        List<OrderResponseDTO> orders =
                orderService.getOrdersByUser(
                        userId
                );

        return ResponseEntity.ok(
                orders
        );
    }
}