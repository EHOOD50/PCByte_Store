package com.asthood.techstore.service.mail;

/*
 * Contenido completo de un correo preparado
 * para ser enviado.
 */
public record MailContent(
        String subject,
        String htmlBody
) {

    public MailContent {
        if (
                subject == null ||
                        subject.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El asunto del correo es obligatorio."
            );
        }

        if (
                htmlBody == null ||
                        htmlBody.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El contenido del correo es obligatorio."
            );
        }
    }
}