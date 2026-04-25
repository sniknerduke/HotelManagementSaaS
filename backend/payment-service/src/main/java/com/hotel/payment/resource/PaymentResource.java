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
import com.hotel.payment.vnpay.VNPayService;
import java.math.BigDecimal;
import java.net.URI;
import java.util.UUID;

@Path("/api/payments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaymentResource {

    @Inject
    @RestClient
    BookingClient bookingClient;

    @Inject
    VNPayService vnPayService;

    // --- DTOs ---

    public record CreatePaymentRequest(Long reservationId, String paymentMethod, BigDecimal amount) {}
    public record RefundRequest(BigDecimal amount) {}

    public record PaymentResponse(Long id, Long reservationId, BigDecimal amount,
                                  String paymentMethod, String transactionId, String status, String paymentUrl) {
        public static PaymentResponse from(Payment p) {
            return new PaymentResponse(p.id, p.reservationId, p.amount,
                    p.paymentMethod, p.transactionId, p.status.name(), null);
        }
        public static PaymentResponse from(Payment p, String paymentUrl) {
            return new PaymentResponse(p.id, p.reservationId, p.amount,
                    p.paymentMethod, p.transactionId, p.status.name(), paymentUrl);
        }
    }

    // --- Endpoints ---

    @POST
    @RolesAllowed({"GUEST", "USER", "ADMIN"})
    @Transactional
    public Response createPayment(CreatePaymentRequest req, @jakarta.ws.rs.core.Context jakarta.ws.rs.core.UriInfo uriInfo) {
        Payment payment = new Payment();
        payment.reservationId = req.reservationId();
        payment.paymentMethod = req.paymentMethod();
        payment.amount = req.amount();
        payment.transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        if ("VNPAY".equalsIgnoreCase(req.paymentMethod())) {
            payment.status = PaymentStatus.PENDING;
            payment.persist();
            
            // Generate payment URL
            String ipAddr = "127.0.0.1";
            // Return to frontend instead of API, normally it's the frontend URL, but using configured returnUrl for now
            String url = vnPayService.createOrder(req.amount().longValue(), "Payment for reservation " + req.reservationId(), null, ipAddr, payment.transactionId);
            return Response.ok(PaymentResponse.from(payment, url)).build();
        }

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
    @Path("/vnpay-return")
    @Transactional
    public Response vnpayReturn(@jakarta.ws.rs.core.Context jakarta.ws.rs.core.UriInfo uriInfo) {
        java.util.Map<String, String> params = new java.util.HashMap<>();
        uriInfo.getQueryParameters().forEach((k, v) -> params.put(k, v.get(0)));
        
        if (vnPayService.verifyIPN(params)) {
            String vnp_ResponseCode = params.get("vnp_ResponseCode");
            String vnp_TxnRef = params.get("vnp_TxnRef");
            
            Payment payment = Payment.find("transactionId", vnp_TxnRef).firstResult();
            if (payment != null && payment.status == PaymentStatus.PENDING) {
                if ("00".equals(vnp_ResponseCode)) {
                    payment.status = PaymentStatus.COMPLETED;
                    try {
                        bookingClient.updateBookingStatus(payment.reservationId, new BookingClient.UpdateStatusRequest("CONFIRMED"));
                    } catch (Exception e) {
                        // log error
                    }
                    // Redirect to frontend success page
                    return Response.seeOther(URI.create("http://localhost:5173/payment/success?reservationId=" + payment.reservationId)).build();
                } else {
                    payment.status = PaymentStatus.FAILED;
                    // Redirect to frontend failed page
                    return Response.seeOther(URI.create("http://localhost:5173/payment/failed?reservationId=" + payment.reservationId)).build();
                }
            }
        }
        
        return Response.seeOther(URI.create("http://localhost:5173/payment/failed")).build();
    }

    @GET
    @Path("/vnpay-ipn")
    @Transactional
    public Response vnpayIpn(@jakarta.ws.rs.core.Context jakarta.ws.rs.core.UriInfo uriInfo) {
        java.util.Map<String, String> params = new java.util.HashMap<>();
        uriInfo.getQueryParameters().forEach((k, v) -> params.put(k, v.get(0)));

        if (vnPayService.verifyIPN(params)) {
            String vnp_ResponseCode = params.get("vnp_ResponseCode");
            String vnp_TxnRef = params.get("vnp_TxnRef");
            
            Payment payment = Payment.find("transactionId", vnp_TxnRef).firstResult();
            if (payment != null) {
                if (payment.status == PaymentStatus.PENDING) {
                    if ("00".equals(vnp_ResponseCode)) {
                        payment.status = PaymentStatus.COMPLETED;
                        try {
                            bookingClient.updateBookingStatus(payment.reservationId, new BookingClient.UpdateStatusRequest("CONFIRMED"));
                        } catch (Exception e) {}
                    } else {
                        payment.status = PaymentStatus.FAILED;
                    }
                }
                return Response.ok("{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}").build();
            } else {
                return Response.ok("{\"RspCode\":\"01\",\"Message\":\"Order not found\"}").build();
            }
        }
        return Response.ok("{\"RspCode\":\"97\",\"Message\":\"Invalid Checksum\"}").build();
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
