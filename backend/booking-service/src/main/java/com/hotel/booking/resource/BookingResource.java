package com.hotel.booking.resource;

import com.hotel.booking.entity.Reservation;
import com.hotel.booking.entity.Reservation.ReservationStatus;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import com.hotel.booking.client.InventoryClient;

@Path("/api/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookingResource {

    /** VAT rate applied on top of the room cost */
    private static final BigDecimal VAT_RATE = new BigDecimal("0.10"); // 10%

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
            @Min(value = 1, message = "At least 1 adult is required") Integer adultCount,
            @Min(value = 0, message = "Child count cannot be negative") Integer childCount) {

        @AssertTrue(message = "Check-out date must be after check-in date")
        public boolean isValidDates() {
            if (checkInDate == null || checkOutDate == null) return true;
            return checkOutDate.isAfter(checkInDate);
        }

        @AssertTrue(message = "Check-out date must be within 3 months from today")
        public boolean isWithin3Months() {
            if (checkOutDate == null) return true;
            return !checkOutDate.isAfter(LocalDate.now().plusMonths(3));
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

    /** DTO returned by the availability endpoint */
    public record AvailabilityResponse(
            Long roomTypeId, String name, String description,
            BigDecimal basePrice, int maxGuests, String imageUrl,
            List<InventoryClient.AmenityDTO> amenities,
            long availableCount, long nights,
            BigDecimal subtotal, BigDecimal vat, BigDecimal total) {}

    // --- Endpoints ---

    /**
     * Date-aware availability search.
     * Cross-references inventory rooms against existing reservations to find
     * room types that have at least one room free for the requested date range.
     */
    @GET
    @Path("/availability")
    @PermitAll
    public Response checkAvailability(
            @QueryParam("checkIn") String checkInStr,
            @QueryParam("checkOut") String checkOutStr,
            @QueryParam("guests") @DefaultValue("1") int guests) {

        // 1. Parse & validate dates
        LocalDate today = LocalDate.now();
        LocalDate maxDate = today.plusMonths(3);
        LocalDate checkIn;
        LocalDate checkOut;
        try {
            checkIn = LocalDate.parse(checkInStr);
            checkOut = LocalDate.parse(checkOutStr);
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Invalid date format. Use yyyy-MM-dd\"}")
                    .build();
        }

        if (checkIn.isBefore(today)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Check-in date cannot be in the past\"}")
                    .build();
        }
        if (!checkOut.isAfter(checkIn)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Check-out must be after check-in\"}")
                    .build();
        }
        if (checkOut.isAfter(maxDate)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Dates must be within 3 months from today\"}")
                    .build();
        }

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);

        // 2. Get all rooms from inventory
        List<InventoryClient.RoomDTO> allRooms;
        List<InventoryClient.RoomTypeDTO> allRoomTypes;
        try {
            allRooms = inventoryClient.getAllRooms(null, null, null);
            allRoomTypes = inventoryClient.getAllRoomTypes();
        } catch (Exception e) {
            return Response.status(Response.Status.SERVICE_UNAVAILABLE)
                    .entity("{\"error\": \"Inventory service unavailable\"}")
                    .build();
        }

        // 3. Find room IDs that have overlapping ACTIVE reservations
        //    Only PENDING, CONFIRMED, CHECKED_IN block a room. CHECKED_OUT/CANCELLED/NO_SHOW do not.
        List<ReservationStatus> activeStatuses = List.of(
                ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN);
        List<Reservation> overlapping = Reservation.<Reservation>find(
                "status in ?1 and checkInDate < ?3 and checkOutDate > ?2",
                activeStatuses, checkIn, checkOut
        ).list();

        System.out.println("[AVAILABILITY] checkIn=" + checkIn + " checkOut=" + checkOut
                + " guests=" + guests + " overlappingReservations=" + overlapping.size());

        Set<Long> bookedRoomIds = overlapping.stream()
                .map(r -> r.roomId)
                .collect(Collectors.toSet());

        System.out.println("[AVAILABILITY] bookedRoomIds=" + bookedRoomIds);

        // 4. Filter to rooms that are not booked and not out-of-order/maintenance
        Set<String> unavailableStatuses = Set.of("OUT_OF_ORDER", "MAINTENANCE");
        List<InventoryClient.RoomDTO> availableRooms = allRooms.stream()
                .filter(r -> !bookedRoomIds.contains(r.id()))
                .filter(r -> !unavailableStatuses.contains(r.status()))
                .toList();

        // 5. Build a map of roomTypeId -> available room count
        Map<Long, Long> availableByType = availableRooms.stream()
                .filter(r -> r.roomTypeId() != null)
                .collect(Collectors.groupingBy(InventoryClient.RoomDTO::roomTypeId, Collectors.counting()));

        // 6. Build response: room types with enough capacity, at least 1 available room
        List<AvailabilityResponse> result = allRoomTypes.stream()
                .filter(rt -> rt.maxGuests() >= guests)
                .filter(rt -> availableByType.getOrDefault(rt.id(), 0L) > 0)
                .map(rt -> {
                    BigDecimal subtotal = rt.basePrice().multiply(BigDecimal.valueOf(nights));
                    BigDecimal vat = subtotal.multiply(VAT_RATE).setScale(2, RoundingMode.HALF_UP);
                    BigDecimal total = subtotal.add(vat);
                    return new AvailabilityResponse(
                            rt.id(), rt.name(), rt.description(),
                            rt.basePrice(), rt.maxGuests(), rt.imageUrl(),
                            rt.amenities(),
                            availableByType.getOrDefault(rt.id(), 0L),
                            nights, subtotal, vat, total);
                })
                .toList();

        return Response.ok(result).build();
    }

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
        // Validate room exists and is not permanently unavailable
        InventoryClient.RoomDTO room;
        try {
            room = inventoryClient.getRoom(req.roomId());
            if (room == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Room not found\"}")
                        .build();
            }
            // Block only if room is in permanent unavailable states
            String status = room.status();
            if ("OUT_OF_ORDER".equals(status) || "MAINTENANCE".equals(status)) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Room is not available (\" + status + \")\"}")
                        .build();
            }
        } catch (Exception e) {
            String errorMessage = e.getMessage();
            if (errorMessage == null || errorMessage.isEmpty()) {
                errorMessage = "Connection error with inventory service";
            }
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Inventory check failed: " + errorMessage + "\"}")
                    .build();
        }

        long nights = ChronoUnit.DAYS.between(req.checkInDate(), req.checkOutDate());
        if (nights <= 0) {
             return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Check-out date must be after check-in date\"}")
                    .build();
        }

        // Check for overlapping ACTIVE reservations (pessimistic lock)
        List<ReservationStatus> activeStatuses = List.of(
                ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN);
        List<Reservation> overlapping = Reservation.<Reservation>find(
                "roomId = ?1 and status in ?2 and checkInDate < ?4 and checkOutDate > ?3", 
                req.roomId(), activeStatuses, req.checkInDate(), req.checkOutDate()
        ).withLock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE).list();
        if (!overlapping.isEmpty()) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"Room is already booked for these dates.\"}")
                    .build();
        }

        // Server-side price calculation
        BigDecimal basePrice;
        try {
            InventoryClient.RoomTypeDTO roomType = null;
            if (room.roomTypeId() != null) {
                roomType = inventoryClient.getRoomType(room.roomTypeId());
            }
            if (roomType == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Could not determine room price\"}")
                        .build();
            }
            basePrice = roomType.basePrice();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Failed to fetch room pricing: " + e.getMessage() + "\"}")
                    .build();
        }

        BigDecimal subtotal = basePrice.multiply(BigDecimal.valueOf(nights));
        BigDecimal vat = subtotal.multiply(VAT_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalPrice = subtotal.add(vat);

        // NOTE: We no longer mark the room as OCCUPIED here.
        // Room status only changes on actual check-in. Availability is
        // determined by reservation overlap queries.

        Reservation reservation = new Reservation();
        reservation.userId = req.userId();
        reservation.roomId = req.roomId();
        reservation.checkInDate = req.checkInDate();
        reservation.checkOutDate = req.checkOutDate();
        if (req.adultCount() != null) reservation.adultCount = req.adultCount();
        if (req.childCount() != null) reservation.childCount = req.childCount();
        reservation.totalPrice = totalPrice;
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
            inventoryClient.updateRoomStatus(reservation.roomId, new InventoryClient.UpdateStatusRequest("DIRTY"));
        } catch (Exception e) {
            System.err.println("Failed to update room status for check-out: " + e.getMessage());
            e.printStackTrace();
        }
        reservation.status = ReservationStatus.CHECKED_OUT;
        return Response.ok(BookingResponse.from(reservation)).build();
    }
}
