package com.hotel.booking.resource;

import com.hotel.booking.entity.Reservation;
import com.hotel.booking.entity.Reservation.ReservationStatus;
import jakarta.annotation.security.RolesAllowed;
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

    public record UpdateBookingRequest(LocalDate checkInDate, LocalDate checkOutDate, Long roomId,
                                       Integer adultCount, Integer childCount, String guestNotes) {}

    public record BookingResponse(Long id, UUID userId, Long roomId,
                                  LocalDate checkInDate, LocalDate checkOutDate,
                                  BigDecimal totalPrice, Integer adultCount, Integer childCount, 
                                  String guestNotes, String status) {
        public static BookingResponse from(Reservation r) {
            return new BookingResponse(r.id, r.userId, r.roomId,
                    r.checkInDate, r.checkOutDate, r.totalPrice, 
                    r.adultCount, r.childCount, r.guestNotes, r.status.name());
        }
    }

    // --- Endpoints ---

    @GET
    @RolesAllowed("ADMIN")
    public Response getAllBookings() {
        List<BookingResponse> bookings = Reservation.<Reservation>listAll()
                .stream()
                .map(BookingResponse::from)
                .toList();
        return Response.ok(bookings).build();
    }

    @POST
    @RolesAllowed({"GUEST", "USER", "ADMIN"})
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
    @RolesAllowed({"GUEST", "USER", "ADMIN"})
    public Response getUserBookings(@PathParam("userId") UUID userId) {
        List<BookingResponse> bookings = Reservation.findByUserId(userId)
                .stream()
                .map(BookingResponse::from)
                .toList();
        return Response.ok(bookings).build();
    }

    @PATCH
    @Path("/{id}/status")
    @RolesAllowed("ADMIN")
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

    @GET
    @Path("/{id}")
    @RolesAllowed({"GUEST", "USER", "ADMIN"})
    public Response getBooking(@PathParam("id") Long id) {
        Reservation reservation = Reservation.findById(id);
        if (reservation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(BookingResponse.from(reservation)).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"GUEST", "USER", "ADMIN"})
    @Transactional
    public Response updateBooking(@PathParam("id") Long id, UpdateBookingRequest req) {
        Reservation reservation = Reservation.findById(id);
        if (reservation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (req.checkInDate() != null) reservation.checkInDate = req.checkInDate();
        if (req.checkOutDate() != null) reservation.checkOutDate = req.checkOutDate();
        if (req.roomId() != null) reservation.roomId = req.roomId();
        if (req.adultCount() != null) reservation.adultCount = req.adultCount();
        if (req.childCount() != null) reservation.childCount = req.childCount();
        if (req.guestNotes() != null) reservation.guestNotes = req.guestNotes();

        return Response.ok(BookingResponse.from(reservation)).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"GUEST", "USER", "ADMIN"})
    @Transactional
    public Response cancelBooking(@PathParam("id") Long id) {
        Reservation reservation = Reservation.findById(id);
        if (reservation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        reservation.status = ReservationStatus.CANCELLED;
        return Response.noContent().build();
    }

    @POST
    @Path("/{id}/check-in")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response checkIn(@PathParam("id") Long id) {
        Reservation reservation = Reservation.findById(id);
        if (reservation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        // TODO: Call inventory service to set room to OCCUPIED
        reservation.status = ReservationStatus.CHECKED_IN;
        return Response.ok(BookingResponse.from(reservation)).build();
    }

    @POST
    @Path("/{id}/check-out")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response checkOut(@PathParam("id") Long id) {
        Reservation reservation = Reservation.findById(id);
        if (reservation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        // TODO: Call inventory service to set room to CLEANING
        reservation.status = ReservationStatus.CHECKED_OUT;
        return Response.ok(BookingResponse.from(reservation)).build();
    }
}
