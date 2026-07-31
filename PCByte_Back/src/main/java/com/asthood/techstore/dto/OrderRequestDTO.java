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
     * Método de despacho seleccionado por el cliente.
     *
     * Actualmente el frontend envía:
     *
     * home_delivery
     *
     * El backend normalizará este valor antes de consultar
     * ShippingRateService.
     */
    private String shippingMethod;

    /*
     * Total informado por el frontend.
     *
     * Se conserva temporalmente por compatibilidad con el
     * contrato actual, pero nunca debe considerarse autoritativo.
     *
     * El backend calculará:
     *
     * subtotal oficial
     * + despacho oficial
     * = total definitivo
     */
    private Double total;
}