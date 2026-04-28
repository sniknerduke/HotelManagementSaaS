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
import org.eclipse.microprofile.rest.client.inject.RestClient;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import com.hotel.booking.client.InventoryClient;

@Path("/api/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookingResource {

    @Inject
    @RestClient
    InventoryClient inventoryClient;

    // --- DTOs ---

    public record CreateBookingRequest(
            @NotNull(message = "Room ID is required") Long roomId, 
            @NotNull(message = "User ID is required") UUID userId,
            @NotNull(message = "Check-in date is required") 
            @FutureOrPresent(message = "Check-in date cannot be in the past") LocalDate checkInDate, 
            @NotNull(message = "Check-out date is required") LocalDate checkOutDate,
            @NotNull(message = "Total price is required") 
            @Positive(message = "Total price must be positive") BigDecimal totalPrice,
            @Min(value = 1, message = "At least 1 adult is required") Integer adultCount,
            @Min(value = 0, message = "Child count cannot be negative") Integer childCount) {

        @AssertTrue(message = "Check-out date must be after check-in date")
        public boolean isValidDates() {
            if (checkInDate == null || checkOutDate == null) return true;
            return checkOutDate.isAfter(checkInDate);
        }
    }

    public record UpdateStatusRequest(@NotBlank(message = "Status cannot be blank") String status) {}

    public record UpdateBookingRequest(
            @FutureOrPresent(message = "Check-in date cannot be in the past") LocalDate checkInDate, 
            LocalDate checkOutDate, 
            Long roomId,
            @Min(value = 1, message = "At least 1 adult is required") Integer adultCount, 
            @Min(value = 0, message = "Child count cannot be negative") Integer childCount, 
            @Size(max = 500, message = "Guest notes cannot exceed 500 characters") String guestNotes) {

        @AssertTrue(message = "Check-out date must be after check-in date")
        public boolean isValidDates() {
            if (checkInDate == null || checkOutDate == null) return true;
            return checkOutDate.isAfter(checkInDate);
        }
    }

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
    @RolesAllowed({"GUEST", "STAFF", "ADMIN"})
    @Transactional
    public Response createBooking(@Valid CreateBookingRequest req) {
        try {
            InventoryClient.RoomDTO room = inventoryClient.getRoom(req.roomId());
            if (room == null || !"AVAILABLE".equals(room.status())) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Room is not available\"}")
                        .build();
            }
            inventoryClient.updateRoomStatus(req.roomId(), new InventoryClient.UpdateStatusRequest("OCCUPIED"));
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Failed to verify or update room with inventory service: " + e.getMessage() + "\"}")
                    .build();
        }

        Reservation reservation = new Reservation();
        reservation.userId = req.userId();
        reservation.roomId = req.roomId();
        reservation.checkInDate = req.checkInDate();
        if (req.adultCount() != null) reservation.adultCount = req.adultCount();
        if (req.childCount() != null) reservation.childCount = req.childCount();
        reservation.checkOutDate = req.checkOutDate();
        reservation.totalPrice = req.totalPrice();
        reservation.persist();

        return Response.status(Response.Status.CREATED)
                .entity(BookingResponse.from(reservation))
                .build();
    }

    @GET
    @Path("/user/{userId}")
    @RolesAllowed({"GUEST", "STAFF", "ADMIN"})
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
    public Response updateStatus(@PathParam("id") Long id, @Valid UpdateStatusRequest req) {
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
    @RolesAllowed({"GUEST", "STAFF", "ADMIN"})
    public Response getBooking(@PathParam("id") Long id) {
        Reservation reservation = Reservation.findById(id);
        if (reservation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(BookingResponse.from(reservation)).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"GUEST", "STAFF", "ADMIN"})
    @Transactional
    public Response updateBooking(@PathParam("id") Long id, @Valid UpdateBookingRequest req) {
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
    @RolesAllowed({"GUEST", "STAFF", "ADMIN"})
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
        try {
            inventoryClient.updateRoomStatus(reservation.roomId, new InventoryClient.UpdateStatusRequest("OCCUPIED"));
        } catch (Exception e) {
            System.err.println("Failed to update room status for check-in: " + e.getMessage());
            e.printStackTrace();
        }
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
        try {
            inventoryClient.updateRoomStatus(reservation.roomId, new InventoryClient.UpdateStatusRequest("CLEANING"));
        } catch (Exception e) {
            System.err.println("Failed to update room status for check-out: " + e.getMessage());
            e.printStackTrace();
        }
        reservation.status = ReservationStatus.CHECKED_OUT;
        return Response.ok(BookingResponse.from(reservation)).build();
    }
}
