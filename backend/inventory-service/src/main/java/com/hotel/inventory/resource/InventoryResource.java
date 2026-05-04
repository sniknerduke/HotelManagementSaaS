package com.hotel.inventory.resource;

import com.hotel.inventory.entity.Room;
import com.hotel.inventory.entity.RoomType;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/inventory")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class InventoryResource {

    // --- DTOs ---

    public record RoomTypeResponse(Long id, String name, String description,
                                   java.math.BigDecimal basePrice, int maxGuests, String imageUrl, String amenities, long availableCount) {
        public static RoomTypeResponse from(RoomType rt) {
            long available = Room.countAvailableByType(rt.id);
            return new RoomTypeResponse(rt.id, rt.name, rt.description, rt.basePrice, rt.maxGuests, rt.imageUrl, rt.amenities, available);
        }
    }

    public record RoomResponse(Long id, String roomNumber, Integer floor, String status, Long roomTypeId, String imageUrl, String description, String amenities) {
        public static RoomResponse from(Room room) {
            return new RoomResponse(room.id, room.roomNumber, room.floor, room.status.name(),
                    room.roomType != null ? room.roomType.id : null, room.imageUrl, room.description, room.amenities);
        }
    }

    public record CreateRoomRequest(
            @NotBlank(message = "Room number is required") String roomNumber, 
            @NotNull(message = "Room type ID is required") Long roomTypeId,
            String imageUrl,
            String description,
            String amenities) {}

    public record UpdateRoomTypeRequest(
            @NotBlank(message = "Name is required") String name, 
            String description, 
            @NotNull(message = "Base price is required") @Positive(message = "Base price must be positive") java.math.BigDecimal basePrice, 
            @NotNull(message = "Max guests is required") @Min(value = 1, message = "Max guests must be at least 1") Integer maxGuests, 
            String imageUrl,
            String amenities) {}

    public record UpdateRoomRequest(
            String roomNumber, 
            Long roomTypeId, 
            Room.RoomStatus status, 
            Integer floor,
            String imageUrl,
            String description,
            String amenities) {}

    public record UpdateRoomStatusRequest(
            @NotBlank(message = "Status is required") String status) {}

    // --- Endpoints ---

    @GET
    @Path("/rooms/availability")
    @PermitAll
    public Response checkAvailability(
            @QueryParam("checkIn") String checkIn,
            @QueryParam("checkOut") String checkOut,
            @QueryParam("guests") @DefaultValue("1") int guests) {

        List<RoomType> types = RoomType.list("maxGuests >= ?1", guests);
        List<RoomTypeResponse> result = types.stream()
                .map(RoomTypeResponse::from)
                .filter(rt -> rt.availableCount() > 0)
                .toList();

        return Response.ok(result).build();
    }

    @GET
    @Path("/rooms")
    @PermitAll
    public Response getRooms(
            @QueryParam("status") Room.RoomStatus status,
            @QueryParam("type") Long typeId,
            @QueryParam("floor") Integer floor) {
        
        StringBuilder q = new StringBuilder("1 = 1");
        java.util.Map<String, Object> params = new java.util.HashMap<>();
        
        if (status != null) {
            q.append(" and status = :status");
            params.put("status", status);
        }
        if (typeId != null) {
            q.append(" and roomType.id = :typeId");
            params.put("typeId", typeId);
        }
        if (floor != null) {
            q.append(" and floor = :floor");
            params.put("floor", floor);
        }
        
        List<Room> rooms = Room.list(q.toString(), params);
        List<RoomResponse> result = rooms.stream()
                .map(RoomResponse::from)
                .toList();
        return Response.ok(result).build();
    }

    @GET
    @Path("/rooms/{id}")
    @PermitAll
    public Response getRoom(@PathParam("id") Long id) {
        Room room = Room.findById(id);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(RoomResponse.from(room)).build();
    }

    @PUT
    @Path("/rooms/{id}")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response updateRoom(@PathParam("id") Long id, @Valid UpdateRoomRequest req) {
        Room room = Room.findById(id);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (req.roomTypeId() != null) {
            RoomType rt = RoomType.findById(req.roomTypeId());
            if (rt == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Room type not found\"}")
                        .build();
            }
            room.roomType = rt;
        }

        if (req.roomNumber() != null) room.roomNumber = req.roomNumber();
        if (req.status() != null) room.status = req.status();
        if (req.floor() != null) room.floor = req.floor();
        if (req.imageUrl() != null) room.imageUrl = req.imageUrl();
        if (req.description() != null) room.description = req.description();
        if (req.amenities() != null) room.amenities = req.amenities();

        return Response.ok(RoomResponse.from(room)).build();
    }

    @DELETE
    @Path("/rooms/{id}")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response deleteRoom(@PathParam("id") Long id) {
        Room room = Room.findById(id);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        // Soft delete implementation: Setting status to OUT_OF_ORDER
        room.status = Room.RoomStatus.OUT_OF_ORDER;
        return Response.noContent().build();
    }

    @PATCH
    @Path("/rooms/{id}/status")
    @RolesAllowed({"ADMIN", "STAFF", "GUEST"})
    @Transactional
    public Response updateRoomStatus(@PathParam("id") Long id, @Valid UpdateRoomStatusRequest req) {
        Room room = Room.findById(id);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (req.status() != null) {
            try {
                room.status = Room.RoomStatus.valueOf(req.status().toUpperCase());
            } catch (IllegalArgumentException e) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Invalid status: " + req.status() + "\"}").build();
            }
        }
        return Response.ok(RoomResponse.from(room)).build();
    }

    @GET
    @Path("/room-types")
    @PermitAll
    public Response getRoomTypes() {
        List<RoomType> types = RoomType.listAll();
        List<RoomTypeResponse> result = types.stream()
                .map(RoomTypeResponse::from)
                .toList();
        return Response.ok(result).build();
    }

    @GET
    @Path("/room-types/{id}")
    @PermitAll
    public Response getRoomType(@PathParam("id") Long id) {
        RoomType rt = RoomType.findById(id);
        if (rt == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(RoomTypeResponse.from(rt)).build();
    }

    @POST
    @Path("/rooms")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response createRoom(@Valid CreateRoomRequest req) {
        RoomType rt = RoomType.findById(req.roomTypeId());
        if (rt == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Room type not found\"}")
                    .build();
        }

        Room room = new Room();
        room.roomNumber = req.roomNumber();
        room.roomType = rt;
        room.imageUrl = req.imageUrl();
        if (req.description() != null) room.description = req.description();
        if (req.amenities() != null) room.amenities = req.amenities();
        room.persist();

        return Response.status(Response.Status.CREATED)
                .entity("{\"id\": " + room.id + ", \"roomNumber\": \"" + room.roomNumber + "\"}")
                .build();
    }

    @POST
    @Path("/room-types")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response createRoomType(@Valid RoomType roomType) {
        roomType.persist();
        return Response.status(Response.Status.CREATED)
                .entity(RoomTypeResponse.from(roomType))
                .build();
    }

    @PUT
    @Path("/room-types/{id}")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response updateRoomType(@PathParam("id") Long id, @Valid UpdateRoomTypeRequest req) {
        RoomType rt = RoomType.findById(id);
        if (rt == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (req.name() != null) rt.name = req.name();
        if (req.description() != null) rt.description = req.description();
        if (req.basePrice() != null) rt.basePrice = req.basePrice();
        if (req.maxGuests() != null) rt.maxGuests = req.maxGuests();
        if (req.imageUrl() != null) rt.imageUrl = req.imageUrl();
        if (req.amenities() != null) rt.amenities = req.amenities();

        return Response.ok(RoomTypeResponse.from(rt)).build();
    }

    @DELETE
    @Path("/room-types/{id}")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response deleteRoomType(@PathParam("id") Long id) {
        RoomType rt = RoomType.findById(id);
        if (rt == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        long attachedRooms = Room.count("roomType.id = ?1", id);
        if (attachedRooms > 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Cannot delete room type because it has attached rooms\"}")
                    .build();
        }

        rt.delete();
        return Response.noContent().build();
    }
}
