package com.asthood.techstore.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
public class OrderRequestDTO {
    private Long userId; // Viene si está logueado
    private PayerDTO payer;
    private List<CartItemDTO> items;
    private Double total;


}