package com.asthood.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {

    /*
     * URL del proveedor de pago.
     */
    private String checkoutUrl;

    /*
     * Orden asociada al checkout.
     * El frontend la conservará para reutilizarla
     * cuando el cliente reintente el pago.
     */
    private Long orderId;

    /*
     * Mantiene compatibilidad temporal con:
     *
     * new PaymentResponseDTO(checkoutUrl)
     */
    public PaymentResponseDTO(
            String checkoutUrl
    ) {
        this.checkoutUrl = checkoutUrl;
        this.orderId = null;
    }
}