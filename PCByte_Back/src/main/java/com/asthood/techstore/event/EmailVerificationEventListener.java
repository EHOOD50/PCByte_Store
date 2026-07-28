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
 * Envía el correo solamente después de que la transacción
 * que guardó al usuario y al token terminó correctamente.
 *
 * Si el proveedor SMTP falla, la cuenta y el token se
 * mantienen guardados. El cliente podrá solicitar un
 * reenvío posteriormente.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EmailVerificationEventListener {

    private final MailService mailService;

    private final MailTemplateService
            mailTemplateService;

    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void handleEmailVerificationRequested(
            EmailVerificationRequestedEvent event
    ) {
        try {
            MailContent content =
                    mailTemplateService
                            .buildAccountVerificationEmail(
                                    event.firstName(),
                                    event.rawToken(),
                                    event.expiresAt()
                            );

            mailService.sendHtmlEmail(
                    event.email(),
                    content
            );

            log.info(
                    "Correo de verificación enviado correctamente a {}.",
                    maskEmail(event.email())
            );
        } catch (Exception exception) {
            /*
             * No propagamos el error porque la transacción
             * ya fue confirmada.
             *
             * Más adelante podremos reemplazar este mecanismo
             * por un transactional outbox con reintentos.
             */
            log.error(
                    "No fue posible enviar el correo de verificación a {}.",
                    maskEmail(event.email()),
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