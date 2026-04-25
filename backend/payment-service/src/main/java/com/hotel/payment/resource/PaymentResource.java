package com.hotel.payment.resource;

import com.hotel.payment.entity.Payment;
import com.hotel.payment.entity.Payment.PaymentStatus;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import jakarta.inject.Inject;
import com.hotel.payment.client.BookingClient;
import java.math.BigDecimal;
import java.util.UUID;

@Path("/api/payments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaymentResource {

    @Inject
    @RestClient
    BookingClient bookingClient;

    // --- DTOs ---

    public record CreatePaymentRequest(Long reservationId, String paymentMethod, BigDecimal amount) {}
    public record RefundRequest(BigDecimal amount) {}

    public record PaymentResponse(Long id, Long reservationId, BigDecimal amount,
                                  String paymentMethod, String transactionId, String status) {
        public static PaymentResponse from(Payment p) {
            return new PaymentResponse(p.id, p.reservationId, p.amount,
                    p.paymentMethod, p.transactionId, p.status.name());
        }
    }

    // --- Endpoints ---

    @POST
    @RolesAllowed({"GUEST", "USER", "ADMIN"})
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

        try {
            bookingClient.updateBookingStatus(req.reservationId(), new BookingClient.UpdateStatusRequest("CONFIRMED"));
        } catch (Exception e) {
            // Handle if booking service fails
        }

        return Response.ok(PaymentResponse.from(payment)).build();
    }

    @GET
    @Path("/reservation/{reservationId}")
    @RolesAllowed({"GUEST", "USER", "ADMIN"})
    public Response getByReservation(@PathParam("reservationId") Long reservationId) {
        Payment payment = Payment.findByReservationId(reservationId);
        if (payment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(PaymentResponse.from(payment)).build();
    }

    @GET
    @RolesAllowed("ADMIN")
    public Response getAllPayments(
            @QueryParam("status") PaymentStatus status,
            @QueryParam("startDate") String startDate,
            @QueryParam("endDate") String endDate) {
        
        StringBuilder q = new StringBuilder("1 = 1");
        java.util.Map<String, Object> params = new java.util.HashMap<>();
        
        if (status != null) {
            q.append(" and status = :status");
            params.put("status", status);
        }
        if (startDate != null) {
            try {
                q.append(" and paymentDate >= :startDate");
                params.put("startDate", java.time.Instant.parse(startDate + "T00:00:00Z"));
            } catch (Exception e) {}
        }
        if (endDate != null) {
            try {
                q.append(" and paymentDate <= :endDate");
                params.put("endDate", java.time.Instant.parse(endDate + "T23:59:59Z"));
            } catch (Exception e) {}
        }
        
        java.util.List<Payment> payments = Payment.list(q.toString(), params);
        return Response.ok(payments.stream().map(PaymentResponse::from).toList()).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"GUEST", "USER", "ADMIN"})
    public Response getPayment(@PathParam("id") Long id) {
        Payment payment = Payment.findById(id);
        if (payment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(PaymentResponse.from(payment)).build();
    }

    @POST
    @Path("/{id}/refund")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response refundPayment(@PathParam("id") Long id, RefundRequest req) {
        Payment payment = Payment.findById(id);
        if (payment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        if (payment.status != PaymentStatus.COMPLETED) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Only completed payments can be refunded\"}")
                    .build();
        }

        // Logic to interact with actual payment gateway for refund would go here
        payment.status = PaymentStatus.REFUNDED;
        
        return Response.ok(PaymentResponse.from(payment)).build();
    }
}
