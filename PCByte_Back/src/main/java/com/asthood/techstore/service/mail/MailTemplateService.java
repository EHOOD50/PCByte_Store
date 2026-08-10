package com.asthood.techstore.service.mail;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class MailTemplateService {

    private static final ZoneId CHILE_ZONE =
            ZoneId.of(
                    "America/Santiago"
            );

    private static final DateTimeFormatter
            EXPIRATION_FORMATTER =
            DateTimeFormatter.ofPattern(
                    "dd 'de' MMMM 'de' yyyy, HH:mm",
                    Locale.forLanguageTag(
                            "es-CL"
                    )
            );

    private final String frontendUrl;

    public MailTemplateService(
            @Value(
                    "${app.frontend-url}"
            )
            String frontendUrl
    ) {
        this.frontendUrl =
                normalizeFrontendUrl(
                        frontendUrl
                );
    }

    /*
     * Construye el mensaje utilizado para activar
     * una cuenta nueva.
     */
    public MailContent buildAccountVerificationEmail(
            String firstName,
            String rawToken,
            LocalDateTime expiresAtUtc
    ) {
        String safeFirstName =
                HtmlUtils.htmlEscape(
                        normalizeFirstName(
                                firstName
                        )
                );

        String verificationUrl =
                buildVerificationUrl(
                        rawToken
                );

        String formattedExpiration =
                formatExpiration(
                        expiresAtUtc
                );

        String subject =
                "Verifica tu Cuenta PCByte";

        String html =
                """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0">

                    <title>Verifica tu Cuenta PCByte</title>
                </head>

                <body style="
                    margin: 0;
                    padding: 0;
                    background-color: #eef3f8;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #0f172a;
                ">
                    <table role="presentation"
                           width="100%%"
                           cellspacing="0"
                           cellpadding="0"
                           style="
                               width: 100%%;
                               background-color: #eef3f8;
                               padding: 32px 16px;
                           ">
                        <tr>
                            <td align="center">

                                <table role="presentation"
                                       width="100%%"
                                       cellspacing="0"
                                       cellpadding="0"
                                       style="
                                           width: 100%%;
                                           max-width: 620px;
                                           overflow: hidden;
                                           border: 1px solid #dbe3ec;
                                           border-radius: 24px;
                                           background-color: #ffffff;
                                           box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
                                       ">

                                    <tr>
                                        <td style="
                                            padding: 28px 32px;
                                            background-color: #08101d;
                                        ">
                                            <table role="presentation"
                                                   width="100%%"
                                                   cellspacing="0"
                                                   cellpadding="0">
                                                <tr>
                                                    <td>
                                                        <div style="
                                                            display: inline-block;
                                                            border-radius: 14px;
                                                            background-color: #97cf00;
                                                            padding: 12px 16px;
                                                            color: #08101d;
                                                            font-size: 20px;
                                                            font-weight: 900;
                                                        ">
                                                            PCByte
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="
                                                        padding-top: 16px;
                                                        color: #94a3b8;
                                                        font-size: 12px;
                                                        font-weight: 700;
                                                        letter-spacing: 1.5px;
                                                        text-transform: uppercase;
                                                    ">
                                                        Tecnología que conecta
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 36px 32px 20px;">
                                            <div style="
                                                color: #0066ff;
                                                font-size: 11px;
                                                font-weight: 900;
                                                letter-spacing: 1.8px;
                                                text-transform: uppercase;
                                            ">
                                                Verificación de correo
                                            </div>

                                            <h1 style="
                                                margin: 12px 0 0;
                                                color: #0f172a;
                                                font-size: 28px;
                                                line-height: 1.2;
                                            ">
                                                Activa tu Cuenta PCByte
                                            </h1>

                                            <p style="
                                                margin: 22px 0 0;
                                                color: #475569;
                                                font-size: 15px;
                                                line-height: 1.7;
                                            ">
                                                Hola, <strong>%s</strong>.
                                            </p>

                                            <p style="
                                                margin: 12px 0 0;
                                                color: #475569;
                                                font-size: 15px;
                                                line-height: 1.7;
                                            ">
                                                Recibimos una solicitud para crear
                                                una Cuenta PCByte con este correo.
                                                Confirma que el correo te pertenece
                                                presionando el siguiente botón.
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center"
                                            style="padding: 14px 32px 26px;">

                                            <a href="%s"
                                               target="_blank"
                                               rel="noopener noreferrer"
                                               style="
                                                   display: inline-block;
                                                   border-radius: 14px;
                                                   background-color: #0066ff;
                                                   padding: 15px 28px;
                                                   color: #ffffff;
                                                   font-size: 13px;
                                                   font-weight: 900;
                                                   letter-spacing: 0.6px;
                                                   text-decoration: none;
                                                   text-transform: uppercase;
                                               ">
                                                Verificar mi correo
                                            </a>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 0 32px 30px;">
                                            <div style="
                                                border: 1px solid #dbe3ec;
                                                border-radius: 16px;
                                                background-color: #f8fafc;
                                                padding: 18px;
                                            ">
                                                <p style="
                                                    margin: 0;
                                                    color: #334155;
                                                    font-size: 13px;
                                                    font-weight: 700;
                                                ">
                                                    Este enlace vencerá el:
                                                </p>

                                                <p style="
                                                    margin: 6px 0 0;
                                                    color: #64748b;
                                                    font-size: 13px;
                                                ">
                                                    %s hrs. (hora de Chile)
                                                </p>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 0 32px 30px;">
                                            <p style="
                                                margin: 0;
                                                color: #64748b;
                                                font-size: 12px;
                                                line-height: 1.6;
                                            ">
                                                Si el botón no funciona, copia y
                                                pega el siguiente enlace en tu navegador:
                                            </p>

                                            <p style="
                                                margin: 10px 0 0;
                                                word-break: break-all;
                                                color: #0066ff;
                                                font-size: 12px;
                                                line-height: 1.6;
                                            ">
                                                %s
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="
                                            border-top: 1px solid #e2e8f0;
                                            padding: 22px 32px;
                                            background-color: #f8fafc;
                                        ">
                                            <p style="
                                                margin: 0;
                                                color: #64748b;
                                                font-size: 11px;
                                                line-height: 1.6;
                                            ">
                                                Si no solicitaste esta cuenta,
                                                puedes ignorar este mensaje.
                                                La cuenta no será activada mientras
                                                el enlace no sea utilizado.
                                            </p>

                                            <p style="
                                                margin: 14px 0 0;
                                                color: #94a3b8;
                                                font-size: 10px;
                                            ">
                                                © PCByte Store
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """
                        .formatted(
                                safeFirstName,
                                verificationUrl,
                                formattedExpiration,
                                verificationUrl
                        );

        return new MailContent(
                subject,
                html
        );
    }
    public MailContent buildGuestVerificationCodeEmail(
            String rawCode,
            LocalDateTime expiresAtUtc
    ) {
        if (
                rawCode == null ||
                        !rawCode.matches("\\d{6}")
        ) {
            throw new IllegalArgumentException(
                    "El código de verificación debe contener exactamente 6 dígitos."
            );
        }

        String formattedExpiration =
                formatExpiration(
                        expiresAtUtc
                );

        String subject =
                "Tu código de verificación PCByte";

        String html =
                """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0">
    
                    <title>Tu código de verificación PCByte</title>
                </head>
    
                <body style="
                    margin: 0;
                    padding: 0;
                    background-color: #eef3f8;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #0f172a;
                ">
                    <table role="presentation"
                           width="100%%"
                           cellspacing="0"
                           cellpadding="0"
                           style="
                               width: 100%%;
                               background-color: #eef3f8;
                               padding: 32px 16px;
                           ">
                        <tr>
                            <td align="center">
    
                                <table role="presentation"
                                       width="100%%"
                                       cellspacing="0"
                                       cellpadding="0"
                                       style="
                                           width: 100%%;
                                           max-width: 620px;
                                           overflow: hidden;
                                           border: 1px solid #dbe3ec;
                                           border-radius: 24px;
                                           background-color: #ffffff;
                                           box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
                                       ">
    
                                    <tr>
                                        <td style="
                                            padding: 28px 32px;
                                            background-color: #08101d;
                                        ">
                                            <table role="presentation"
                                                   width="100%%"
                                                   cellspacing="0"
                                                   cellpadding="0">
                                                <tr>
                                                    <td>
                                                        <div style="
                                                            display: inline-block;
                                                            border-radius: 14px;
                                                            background-color: #97cf00;
                                                            padding: 12px 16px;
                                                            color: #08101d;
                                                            font-size: 20px;
                                                            font-weight: 900;
                                                        ">
                                                            PCByte
                                                        </div>
                                                    </td>
                                                </tr>
    
                                                <tr>
                                                    <td style="
                                                        padding-top: 16px;
                                                        color: #94a3b8;
                                                        font-size: 12px;
                                                        font-weight: 700;
                                                        letter-spacing: 1.5px;
                                                        text-transform: uppercase;
                                                    ">
                                                        Tecnología que conecta
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td style="padding: 36px 32px 18px;">
                                            <div style="
                                                color: #0066ff;
                                                font-size: 11px;
                                                font-weight: 900;
                                                letter-spacing: 1.8px;
                                                text-transform: uppercase;
                                            ">
                                                Verificación de correo
                                            </div>
    
                                            <h1 style="
                                                margin: 12px 0 0;
                                                color: #0f172a;
                                                font-size: 28px;
                                                line-height: 1.2;
                                            ">
                                                Confirma tu correo para continuar
                                            </h1>
    
                                            <p style="
                                                margin: 20px 0 0;
                                                color: #475569;
                                                font-size: 15px;
                                                line-height: 1.7;
                                            ">
                                                Para continuar con tu compra como invitado,
                                                ingresa el siguiente código en PCByte.
                                            </p>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td align="center"
                                            style="padding: 10px 32px 26px;">
    
                                            <div style="
                                                display: inline-block;
                                                min-width: 250px;
                                                border: 1px solid #cbd5e1;
                                                border-radius: 18px;
                                                background-color: #f8fafc;
                                                padding: 22px 28px;
                                            ">
                                                <div style="
                                                    color: #64748b;
                                                    font-size: 11px;
                                                    font-weight: 900;
                                                    letter-spacing: 1.5px;
                                                    text-transform: uppercase;
                                                ">
                                                    Código de verificación
                                                </div>
    
                                                <div style="
                                                    margin-top: 10px;
                                                    color: #08101d;
                                                    font-size: 38px;
                                                    font-weight: 900;
                                                    letter-spacing: 10px;
                                                ">
                                                    %s
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td style="padding: 0 32px 28px;">
                                            <div style="
                                                border: 1px solid #dbe3ec;
                                                border-radius: 16px;
                                                background-color: #f8fafc;
                                                padding: 18px;
                                            ">
                                                <p style="
                                                    margin: 0;
                                                    color: #334155;
                                                    font-size: 13px;
                                                    font-weight: 700;
                                                ">
                                                    Este código vencerá el:
                                                </p>
    
                                                <p style="
                                                    margin: 6px 0 0;
                                                    color: #64748b;
                                                    font-size: 13px;
                                                ">
                                                    %s hrs. (hora de Chile)
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td style="
                                            border-top: 1px solid #e2e8f0;
                                            padding: 22px 32px;
                                            background-color: #f8fafc;
                                        ">
                                            <p style="
                                                margin: 0;
                                                color: #64748b;
                                                font-size: 11px;
                                                line-height: 1.6;
                                            ">
                                                Si no solicitaste este código,
                                                puedes ignorar este mensaje.
                                                No compartas este código con otras personas.
                                            </p>
    
                                            <p style="
                                                margin: 14px 0 0;
                                                color: #94a3b8;
                                                font-size: 10px;
                                            ">
                                                © PCByte Store
                                            </p>
                                        </td>
                                    </tr>
    
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """
                        .formatted(
                                rawCode,
                                formattedExpiration
                        );

        return new MailContent(
                subject,
                html
        );
    }
    private String buildVerificationUrl(
            String rawToken
    ) {
        if (
                rawToken == null ||
                        rawToken.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El token del correo es obligatorio."
            );
        }

        return UriComponentsBuilder
                .fromUriString(
                        frontendUrl
                )
                .path(
                        "/verificar-cuenta"
                )
                .queryParam(
                        "token",
                        rawToken
                )
                .build()
                .encode()
                .toUriString();
    }

    private String formatExpiration(
            LocalDateTime expiresAtUtc
    ) {
        if (expiresAtUtc == null) {
            throw new IllegalArgumentException(
                    "La fecha de vencimiento es obligatoria."
            );
        }

        return expiresAtUtc
                .atZone(
                        ZoneOffset.UTC
                )
                .withZoneSameInstant(
                        CHILE_ZONE
                )
                .format(
                        EXPIRATION_FORMATTER
                );
    }

    private String normalizeFirstName(
            String firstName
    ) {
        if (
                firstName == null ||
                        firstName.isBlank()
        ) {
            return "cliente";
        }

        return firstName
                .trim()
                .replaceAll(
                        "\\s+",
                        " "
                );
    }

    private String normalizeFrontendUrl(
            String value
    ) {
        if (
                value == null ||
                        value.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "La URL del frontend es obligatoria."
            );
        }

        String normalized =
                value.trim();

        while (
                normalized.endsWith("/")
        ) {
            normalized =
                    normalized.substring(
                            0,
                            normalized.length() - 1
                    );
        }

        return normalized;
    }
}