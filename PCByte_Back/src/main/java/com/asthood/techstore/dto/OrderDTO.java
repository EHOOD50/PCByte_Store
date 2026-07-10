package com.asthood.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;                    // ID de la orden (opcional)
    private BigDecimal total;           // Total de la orden
    private String paymentId;           // ID de pago de Mercado Pago
    private List<CartItemDTO> items;    // Items de la orden
}

