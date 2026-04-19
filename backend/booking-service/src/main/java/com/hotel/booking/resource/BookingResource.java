package com.hotel.booking.resource;

import com.hotel.booking.entity.Reservation;
import com.hotel.booking.entity.Reservation.ReservationStatus;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Path("/api/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookingResource {

    // --- DTOs ---

    public record CreateBookingRequest(Long roomId, UUID userId,
                                       LocalDate checkInDate, LocalDate checkOutDate,
                                       BigDecimal totalPrice) {}

    public record UpdateStatusRequest(String status) {}

    public record BookingResponse(Long id, UUID userId, Long roomId,
                                  LocalDate checkInDate, LocalDate checkOutDate,
                                  BigDecimal totalPrice, String status) {
        public static BookingResponse from(Reservation r) {
            return new BookingResponse(r.id, r.userId, r.roomId,
                    r.checkInDate, r.checkOutDate, r.totalPrice, r.status.name());
        }
    }

    // --- Endpoints ---

    @POST
    @Transactional
    public Response createBooking(CreateBookingRequest req) {
        // TODO: Call Inventory Service to verify room availability & lock room
        Reservation reservation = new Reservation();
        reservation.userId = req.userId();
        reservation.roomId = req.roomId();
        reservation.checkInDate = req.checkInDate();
        reservation.checkOutDate = req.checkOutDate();
        reservation.totalPrice = req.totalPrice();
        reservation.persist();

        return Response.status(Response.Status.CREATED)
                .entity(BookingResponse.from(reservation))
                .build();
    }

    @GET
    @Path("/user/{userId}")
    public Response getUserBookings(@PathParam("userId") UUID userId) {
        List<BookingResponse> bookings = Reservation.findByUserId(userId)
                .stream()
                .map(BookingResponse::from)
                .toList();
        return Response.ok(bookings).build();
    }

    @PATCH
    @Path("/{id}/status")
    @Transactional
    public Response updateStatus(@PathParam("id") Long id, UpdateStatusRequest req) {
        Reservation reservation = Reservation.findById(id);
        if (reservation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        try {
            reservation.status = ReservationStatus.valueOf(req.status());
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Invalid status: " + req.status() + "\"}")
                    .build();
        }

        return Response.ok(BookingResponse.from(reservation)).build();
    }
}
