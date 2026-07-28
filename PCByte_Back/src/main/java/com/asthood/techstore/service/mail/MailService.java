package com.asthood.techstore.service.mail;

/*
 * Contrato general para el envío de correos.
 *
 * No construye plantillas ni conoce tokens.
 * Solo recibe un mensaje preparado y lo envía.
 */
public interface MailService {

    void sendHtmlEmail(
            String to,
            MailContent content
    );
}