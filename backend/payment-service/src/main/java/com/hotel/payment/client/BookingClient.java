package com.hotel.payment.client;

import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/api/bookings")
@RegisterRestClient(configKey = "booking-api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface BookingClient {

    @PATCH
    @Path("/{id}/status")
    BookingDTO updateBookingStatus(@PathParam("id") Long id, UpdateStatusRequest req);

    record BookingDTO(Long id, String status) {}
    record UpdateStatusRequest(String status) {}
}
