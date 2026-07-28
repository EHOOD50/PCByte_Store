package com.asthood.techstore.service.mail;

import com.asthood.techstore.config.MailProperties;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class MailServiceImpl
        implements MailService {

    private final JavaMailSender javaMailSender;

    private final MailProperties mailProperties;

    @Override
    public void sendHtmlEmail(
            String to,
            MailContent content
    ) {
        String normalizedRecipient =
                normalizeEmail(to);

        validateContent(content);

        MimeMessage mimeMessage =
                javaMailSender
                        .createMimeMessage();

        try {
            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            mimeMessage,
                            false,
                            StandardCharsets.UTF_8
                                    .name()
                    );

            helper.setFrom(
                    mailProperties
                            .getFromAddress(),
                    mailProperties
                            .getFromName()
            );

            helper.setReplyTo(
                    mailProperties
                            .getReplyTo()
            );

            helper.setTo(
                    normalizedRecipient
            );

            helper.setSubject(
                    content.subject()
            );

            helper.setText(
                    content.htmlBody(),
                    true
            );

            javaMailSender.send(
                    mimeMessage
            );
        } catch (
                MessagingException |
                MailException exception
        ) {
            throw new IllegalStateException(
                    "No fue posible enviar el correo electrónico.",
                    exception
            );
        } catch (
                java.io.UnsupportedEncodingException exception
        ) {
            throw new IllegalStateException(
                    "No fue posible configurar el remitente del correo.",
                    exception
            );
        }
    }

    private void validateContent(
            MailContent content
    ) {
        if (content == null) {
            throw new IllegalArgumentException(
                    "El contenido del correo es obligatorio."
            );
        }
    }

    private String normalizeEmail(
            String email
    ) {
        if (
                email == null ||
                        email.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El destinatario del correo es obligatorio."
            );
        }

        return email
                .trim()
                .toLowerCase(
                        Locale.ROOT
                );
    }
}