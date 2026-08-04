package com.asthood.techstore.config;

import com.mercadopago.MercadoPagoConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MercadoPagoSdkConfig {

    public MercadoPagoSdkConfig(
            @Value("${mercadopago.access.token}")
            String accessToken
    ) {
        if (
                accessToken == null ||
                        accessToken.isBlank()
        ) {
            throw new IllegalStateException(
                    "El access token de Mercado Pago no está configurado."
            );
        }

        MercadoPagoConfig.setAccessToken(
                accessToken.trim()
        );
    }
}