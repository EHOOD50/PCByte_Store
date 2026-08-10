package com.asthood.techstore.event;

import com.asthood.techstore.service.mail.MailContent;
import com.asthood.techstore.service.mail.MailService;
import com.asthood.techstore.service.mail.MailTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/*
 * Envía el correo del código de verificación
 * solamente después de que la transacción fue
 * confirmada correctamente.
 *
 * Si SMTP falla, el código permanece almacenado
 * y el cliente podrá solicitar un nuevo envío.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GuestVerificationCodeEventListener {

    private final MailService mailService;

    private final MailTemplateService
            mailTemplateService;

    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void handleGuestVerificationRequested(
            GuestVerificationCodeRequestedEvent event
    ) {

        try {

            MailContent content =
                    mailTemplateService
                            .buildGuestVerificationCodeEmail(
                                    event.rawCode(),
                                    event.expiresAt()
                            );

            mailService.sendHtmlEmail(
                    event.email(),
                    content
            );

            log.info(
                    "Código de verificación enviado correctamente a {}.",
                    maskEmail(
                            event.email()
                    )
            );

        } catch (Exception exception) {

            /*
             * No propagamos la excepción.
             *
             * La transacción ya fue confirmada.
             */

            log.error(
                    "No fue posible enviar el código de verificación a {}.",
                    maskEmail(
                            event.email()
                    ),
                    exception
            );
        }
    }

    private String maskEmail(
            String email
    ) {

        if (
                email == null ||
                        email.isBlank() ||
                        !email.contains("@")
        ) {
            return "***";
        }

        String[] parts =
                email.split(
                        "@",
                        2
                );

        String localPart =
                parts[0];

        String domain =
                parts[1];

        String visibleLocalPart =
                localPart.length() <= 2
                        ? localPart.substring(
                        0,
                        1
                )
                        : localPart.substring(
                        0,
                        2
                );

        return visibleLocalPart +
                "***@" +
                domain;
    }
}