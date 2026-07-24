package com.asthood.techstore.controller;

import com.asthood.techstore.dto.ShippingQuoteDTO;
import com.asthood.techstore.service.ShippingRateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/shipping")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ShippingController {

    private final ShippingRateService shippingRateService;

    // =========================================================
    // COTIZAR DESPACHO
    // =========================================================

    @GetMapping("/quote")
    public ResponseEntity<ShippingQuoteDTO> quote(
            @RequestParam String region,

            @RequestParam(
                    required = false
            ) String city,

            @RequestParam(
                    required = false,
                    defaultValue = "0"
            ) BigDecimal subtotal,

            @RequestParam(
                    required = false,
                    defaultValue = "HOME_DELIVERY"
            ) String shippingType
    ) {
        ShippingQuoteDTO quote =
                shippingRateService.quote(
                        region,
                        city,
                        subtotal,
                        shippingType
                );

        return ResponseEntity.ok(
                quote
        );
    }
}