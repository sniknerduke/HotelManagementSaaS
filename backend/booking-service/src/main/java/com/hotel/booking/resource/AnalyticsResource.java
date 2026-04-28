package com.hotel.booking.resource;

import com.hotel.booking.service.AnalyticsService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/analytics")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
// @RolesAllowed({"ADMIN", "MANAGER"}) // Optional: Uncomment to restrict access
public class AnalyticsResource {

    @Inject
    AnalyticsService analyticsService;

    @GET
    @Path("/overview")
    public Response getOverview() {
        return Response.ok(analyticsService.getOverview()).build();
    }

    @GET
    @Path("/bookings")
    public Response getBookings(@QueryParam("period") @DefaultValue("30d") String period) {
        return Response.ok(analyticsService.getBookings(period)).build();
    }

    @GET
    @Path("/revenue")
    public Response getRevenue(@QueryParam("period") @DefaultValue("30d") String period) {
        return Response.ok(analyticsService.getRevenue(period)).build();
    }

    @GET
    @Path("/occupancy")
    public Response getOccupancy() {
        return Response.ok(analyticsService.getOccupancy()).build();
    }

    @GET
    @Path("/today")
    public Response getTodayStats() {
        return Response.ok(analyticsService.getTodayStats()).build();
    }
}