package com.hotel.inventory.resource;

import com.hotel.inventory.entity.Room;
import com.hotel.inventory.entity.RoomType;
import jakarta.transaction.Transactional;
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
                                   java.math.BigDecimal basePrice, int maxGuests, String imageUrl, long availableCount) {
        public static RoomTypeResponse from(RoomType rt) {
            long available = Room.countAvailableByType(rt.id);
            return new RoomTypeResponse(rt.id, rt.name, rt.description, rt.basePrice, rt.maxGuests, rt.imageUrl, available);
        }
    }

    public record CreateRoomRequest(String roomNumber, Long roomTypeId) {}

    public record UpdateRoomTypeRequest(String name, String description, java.math.BigDecimal basePrice, Integer maxGuests, String imageUrl) {}

    public record UpdateRoomRequest(String roomNumber, Long roomTypeId, Room.RoomStatus status, Integer floor) {}

    public record UpdateRoomStatusRequest(Room.RoomStatus status) {}

    // --- Endpoints ---

    @GET
    @Path("/rooms/availability")
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
    public Response getRooms(
            @QueryParam("status") Room.RoomStatus status,
            @QueryParam("type") Long typeId,
            @QueryParam("floor") Integer floor) {
        
        io.quarkus.hibernate.orm.panache.PanacheQuery<Room> query = Room.findAll();
        
        if (status != null) {
            query.filter("status", io.quarkus.panache.common.Parameters.with("status", status));
            // Actually it's easier to build the query dynamically or just fetch all and filter for simple cases
            // But we can just use string concatenation with Panache
        }
        
        // Let's just build it this way
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
        return Response.ok(rooms).build();
    }

    @GET
    @Path("/rooms/{id}")
    public Response getRoom(@PathParam("id") Long id) {
        Room room = Room.findById(id);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(room).build();
    }

    @PUT
    @Path("/rooms/{id}")
    @Transactional
    public Response updateRoom(@PathParam("id") Long id, UpdateRoomRequest req) {
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

        return Response.ok(room).build();
    }

    @DELETE
    @Path("/rooms/{id}")
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
    @Transactional
    public Response updateRoomStatus(@PathParam("id") Long id, UpdateRoomStatusRequest req) {
        Room room = Room.findById(id);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (req.status() != null) {
            room.status = req.status();
        }
        return Response.ok(room).build();
    }

    @GET
    @Path("/room-types")
    public Response getRoomTypes() {
        List<RoomType> types = RoomType.listAll();
        List<RoomTypeResponse> result = types.stream()
                .map(RoomTypeResponse::from)
                .toList();
        return Response.ok(result).build();
    }

    @GET
    @Path("/room-types/{id}")
    public Response getRoomType(@PathParam("id") Long id) {
        RoomType rt = RoomType.findById(id);
        if (rt == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(RoomTypeResponse.from(rt)).build();
    }

    @POST
    @Path("/rooms")
    @Transactional
    public Response createRoom(CreateRoomRequest req) {
        RoomType rt = RoomType.findById(req.roomTypeId());
        if (rt == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Room type not found\"}")
                    .build();
        }

        Room room = new Room();
        room.roomNumber = req.roomNumber();
        room.roomType = rt;
        room.persist();

        return Response.status(Response.Status.CREATED)
                .entity("{\"id\": " + room.id + ", \"roomNumber\": \"" + room.roomNumber + "\"}")
                .build();
    }

    @POST
    @Path("/room-types")
    @Transactional
    public Response createRoomType(RoomType roomType) {
        roomType.persist();
        return Response.status(Response.Status.CREATED)
                .entity(RoomTypeResponse.from(roomType))
                .build();
    }

    @PUT
    @Path("/room-types/{id}")
    @Transactional
    public Response updateRoomType(@PathParam("id") Long id, UpdateRoomTypeRequest req) {
        RoomType rt = RoomType.findById(id);
        if (rt == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (req.name() != null) rt.name = req.name();
        if (req.description() != null) rt.description = req.description();
        if (req.basePrice() != null) rt.basePrice = req.basePrice();
        if (req.maxGuests() != null) rt.maxGuests = req.maxGuests();
        if (req.imageUrl() != null) rt.imageUrl = req.imageUrl();

        return Response.ok(RoomTypeResponse.from(rt)).build();
    }

    @DELETE
    @Path("/room-types/{id}")
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
