package com.asthood.techstore.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {

    /*
     * ID del usuario autenticado.
     * Puede venir vacío para compras como invitado.
     */
    private Long userId;

    /*
     * ID de una orden pendiente creada en un intento anterior.
     * El backend decidirá si puede reutilizarla.
     */
    private Long pendingOrderId;

    /*
     * Datos del comprador y de entrega.
     */
    private PayerDTO payer;

    /*
     * Productos incluidos en la compra.
     */
    private List<CartItemDTO> items;

    /*
     * Total informado por el frontend.
     * El backend debe seguir recalculándolo usando los precios reales.
     */
    private Double total;
}