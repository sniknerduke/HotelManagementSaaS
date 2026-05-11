package com.hotel.booking.service;

import com.hotel.booking.entity.Reservation;
import com.hotel.booking.event.PaymentCompletedEvent;
import io.smallrye.reactive.messaging.annotations.Blocking;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.reactive.messaging.Acknowledgment;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Message;

import java.util.concurrent.CompletionStage;

@ApplicationScoped
public class PaymentEventConsumer {

    @Incoming("payment-completed-in")
    @Acknowledgment(Acknowledgment.Strategy.MANUAL)
    @Blocking
    @Transactional
    public CompletionStage<Void> consumePaymentCompletedEvent(Message<PaymentCompletedEvent> message) {
        PaymentCompletedEvent event = message.getPayload();
        
        System.out.println("Received payment completed event for reservation: " + event.reservationId());

        try {
            Reservation reservation = Reservation.findById(event.reservationId());
            if (reservation != null) {
                // Ensure idempotency: only update if not already CONFIRMED
                if (reservation.status != Reservation.ReservationStatus.CONFIRMED) {
                    reservation.status = Reservation.ReservationStatus.CONFIRMED;
                    reservation.persist();
                    System.out.println("Successfully updated reservation " + event.reservationId() + " to CONFIRMED.");
                } else {
                    System.out.println("Reservation " + event.reservationId() + " is already CONFIRMED. Ignoring duplicate event.");
                }
            } else {
                System.err.println("Reservation " + event.reservationId() + " not found!");
            }
            
            // Acknowledge the message so RabbitMQ removes it from the queue
            return message.ack();
        } catch (Exception e) {
            System.err.println("Error processing payment completed event: " + e.getMessage());
            // Nack the message so it gets requeued or dead-lettered
            return message.nack(e);
        }
    }
}
