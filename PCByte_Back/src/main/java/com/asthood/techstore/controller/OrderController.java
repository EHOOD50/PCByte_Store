package com.asthood.techstore.controller;

import com.asthood.techstore.dto.OrderResponseDTO;
import com.asthood.techstore.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    // =========================================================
    // PEDIDOS DEL CLIENTE
    // =========================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponseDTO>>
    getOrdersByUser(
            @PathVariable
            Long userId
    ) {
        List<OrderResponseDTO> orders =
                orderService
                        .getOrdersByUser(
                                userId
                        );

        return ResponseEntity.ok(
                orders
        );
    }

    // =========================================================
    // CANCELAR ORDEN PENDIENTE
    // =========================================================

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponseDTO> cancelOrder(
            @PathVariable
            Long orderId
    ) {
        try {
            OrderResponseDTO cancelledOrder =
                    orderService
                            .cancelOrder(
                                    orderId
                            );

            log.info(
                    "Solicitud de cancelación completada para la orden #{}.",
                    orderId
            );

            return ResponseEntity.ok(
                    cancelledOrder
            );

        } catch (
                IllegalArgumentException |
                IllegalStateException exception
        ) {
            log.warn(
                    "No fue posible cancelar la orden #{}: {}",
                    orderId,
                    exception.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .build();

        } catch (
                EntityNotFoundException exception
        ) {
            log.warn(
                    "No se encontró la orden #{} para cancelar.",
                    orderId
            );

            return ResponseEntity
                    .notFound()
                    .build();

        } catch (
                Exception exception
        ) {
            log.error(
                    "Error crítico al cancelar la orden #{}.",
                    orderId,
                    exception
            );

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
}