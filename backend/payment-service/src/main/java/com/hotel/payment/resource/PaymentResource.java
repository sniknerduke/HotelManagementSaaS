package com.hotel.payment.resource;

import com.hotel.payment.entity.Payment;
import com.hotel.payment.entity.Payment.PaymentStatus;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.util.UUID;

@Path("/api/payments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaymentResource {

    // --- DTOs ---

    public record CreatePaymentRequest(Long reservationId, String paymentMethod, BigDecimal amount) {}

    public record PaymentResponse(Long id, Long reservationId, BigDecimal amount,
                                  String paymentMethod, String transactionId, String status) {
        public static PaymentResponse from(Payment p) {
            return new PaymentResponse(p.id, p.reservationId, p.amount,
                    p.paymentMethod, p.transactionId, p.status.name());
        }
    }

    // --- Endpoints ---

    @POST
    @Transactional
    public Response createPayment(CreatePaymentRequest req) {
        Payment payment = new Payment();
        payment.reservationId = req.reservationId();
        payment.paymentMethod = req.paymentMethod();
        payment.amount = req.amount();
        // TODO: Integrate with actual payment gateway (Stripe/PayPal)
        payment.transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        payment.status = PaymentStatus.COMPLETED;
        payment.persist();

        return Response.ok(PaymentResponse.from(payment)).build();
    }

    @GET
    @Path("/reservation/{reservationId}")
    public Response getByReservation(@PathParam("reservationId") Long reservationId) {
        Payment payment = Payment.findByReservationId(reservationId);
        if (payment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(PaymentResponse.from(payment)).build();
    }
}
