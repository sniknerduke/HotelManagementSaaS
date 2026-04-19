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
                                   java.math.BigDecimal basePrice, int maxGuests, long availableCount) {
        public static RoomTypeResponse from(RoomType rt) {
            long available = Room.countAvailableByType(rt.id);
            return new RoomTypeResponse(rt.id, rt.name, rt.description, rt.basePrice, rt.maxGuests, available);
        }
    }

    public record CreateRoomRequest(String roomNumber, Long roomTypeId) {}

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
}
