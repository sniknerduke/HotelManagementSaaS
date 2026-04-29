package com.hotel.booking.service;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class EmailService {

    @Inject
    Mailer mailer;

    public void sendBookingConfirmation(String toEmail, String guestName, String bookingRef) {
        mailer.send(
            Mail.withText(toEmail, 
                "Booking Confirmation - " + bookingRef,
                "Dear " + guestName + ",\n\nYour booking has been successfully confirmed. Reference: " + bookingRef + "\n\nThank you for choosing Lumiere Estate.")
        );
    }
}
