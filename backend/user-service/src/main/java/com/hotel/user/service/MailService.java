package com.hotel.user.service;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class MailService {

    @Inject
    Mailer mailer;

    public void sendForgotPasswordEmail(String toEmail, String otp) {
        String subject = "Lumière Estate - Password Reset";
        String htmlBody = "<h1>Password Reset</h1>" +
                "<p>We received a request to reset your password. Here is your One-Time Password (OTP): <strong>" + otp + "</strong></p>" +
                "<p>This code will expire in 15 minutes.</p>" +
                "<br/><p>Warm regards,<br/>The Lumière Estate Team</p>";
                
        mailer.send(Mail.withHtml(toEmail, subject, htmlBody));
    }

    public void sendNewsletterWelcome(String toEmail) {
        String subject = "Welcome to The Lumière Estate Newsletter";
        String htmlBody = "<h1>Welcome!</h1>" +
                "<p>Thank you for subscribing to our exclusive newsletter.</p>" +
                "<p>You will now receive updates on our latest bespoke experiences and offers directly in your inbox.</p>" +
                "<br/><p>Warm regards,<br/>The Lumière Estate Team</p>";
                
        mailer.send(Mail.withHtml(toEmail, subject, htmlBody));
    }
}
