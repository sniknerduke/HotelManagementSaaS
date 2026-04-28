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

@Path("/api/inventory")
@RegisterRestClient(configKey = "inventory-api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface InventoryClient {

    @GET
    @Path("/rooms/{id}")
    RoomDTO getRoom(@PathParam("id") Long id);

    @PATCH
    @Path("/rooms/{id}/status")
    RoomDTO updateRoomStatus(@PathParam("id") Long id, UpdateStatusRequest req);

    record RoomDTO(Long id, String roomNumber, String status) {}
    record UpdateStatusRequest(String status) {}
}
