package com.hotel.booking.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.eclipse.microprofile.rest.client.annotation.RegisterClientHeaders;
import java.math.BigDecimal;
import java.util.List;

@Path("/api/inventory")
@RegisterRestClient(configKey = "inventory-api")
@RegisterClientHeaders
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface InventoryClient {

    @GET
    @Path("/rooms/{id}")
    RoomDTO getRoom(@PathParam("id") Long id);

    @PATCH
    @Path("/rooms/{id}/status")
    RoomDTO updateRoomStatus(@PathParam("id") Long id, UpdateStatusRequest req);

    @GET
    @Path("/rooms")
    List<RoomDTO> getAllRooms(
            @jakarta.ws.rs.QueryParam("status") String status,
            @jakarta.ws.rs.QueryParam("type") Long typeId,
            @jakarta.ws.rs.QueryParam("floor") Integer floor);

    @GET
    @Path("/room-types")
    List<RoomTypeDTO> getAllRoomTypes();

    @GET
    @Path("/room-types/{id}")
    RoomTypeDTO getRoomType(@PathParam("id") Long id);

    record RoomTypeDTO(Long id, String name, String description, BigDecimal basePrice,
                       int maxGuests, String imageUrl, List<AmenityDTO> amenities, long availableCount) {}
    record AmenityDTO(Long id, String name, String icon) {}
    record RoomDTO(Long id, String roomNumber, String status, Long roomTypeId, RoomTypeDTO roomType) {}
    record UpdateStatusRequest(String status) {}
}
