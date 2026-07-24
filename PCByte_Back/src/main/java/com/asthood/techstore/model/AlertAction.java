package com.asthood.techstore.model;

public enum AlertAction {

    /**
     * Abrir un pedido en el módulo Pedidos.
     */
    OPEN_ORDER,

    /**
     * Abrir un producto en el módulo Productos.
     */
    OPEN_PRODUCT,

    /**
     * Abrir un cliente.
     */
    OPEN_CUSTOMER,

    /**
     * Abrir un pago.
     */
    OPEN_PAYMENT,

    /**
     * No existe acción asociada.
     */
    NONE
}