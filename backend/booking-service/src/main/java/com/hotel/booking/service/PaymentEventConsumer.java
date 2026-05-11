package com.hotel.booking.service;

import com.hotel.booking.entity.Reservation;
import com.hotel.booking.event.PaymentCompletedEvent;
import io.smallrye.reactive.messaging.annotations.Blocking;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.reactive.messaging.Acknowledgment;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Message;
import org.jboss.logging.Logger;

import java.util.concurrent.CompletionStage;

@ApplicationScoped
public class PaymentEventConsumer {

    private static final Logger LOG = Logger.getLogger(PaymentEventConsumer.class);

    @Incoming("payment-completed-in")
    @Acknowledgment(Acknowledgment.Strategy.MANUAL)
    @Blocking
    @Transactional
    public CompletionStage<Void> consumePaymentCompletedEvent(Message<PaymentCompletedEvent> message) {
        PaymentCompletedEvent event = message.getPayload();
        
        LOG.infof("Received payment completed event for reservation: %d", event.reservationId());

        try {
            Reservation reservation = Reservation.findById(event.reservationId());
            if (reservation != null) {
                // Ensure idempotency: only update if not already CONFIRMED
                if (reservation.status != Reservation.ReservationStatus.CONFIRMED) {
                    reservation.status = Reservation.ReservationStatus.CONFIRMED;
                    reservation.persist();
                    LOG.infof("Successfully updated reservation %d to CONFIRMED.", event.reservationId());
                } else {
                    LOG.infof("Reservation %d is already CONFIRMED. Ignoring duplicate event.", event.reservationId());
                }
            } else {
                LOG.errorf("Reservation %d not found!", event.reservationId());
            }
            
            // Acknowledge the message so RabbitMQ removes it from the queue
            return message.ack();
        } catch (Exception e) {
            LOG.errorf(e, "Error processing payment completed event for reservation %d", event.reservationId());
            // Nack the message so it gets requeued or dead-lettered
            return message.nack(e);
        }
    }
}

