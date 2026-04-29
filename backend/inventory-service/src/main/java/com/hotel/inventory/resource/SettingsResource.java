package com.hotel.inventory.resource;

import com.hotel.inventory.entity.HotelSettings;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/settings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SettingsResource {

    @GET
    @PermitAll
    @Transactional
    public Response getSettings() {
        HotelSettings settings = HotelSettings.findById(1L);
        if (settings == null) {
            settings = new HotelSettings();
            settings.id = 1L;
            settings.persist();
        }
        return Response.ok(settings).build();
    }

    @PUT
    @RolesAllowed("ADMIN")
    @Transactional
    public Response updateSettings(HotelSettings req) {
        HotelSettings settings = HotelSettings.findById(1L);
        if (settings == null) {
            settings = new HotelSettings();
            settings.id = 1L;
        }

        if (req.hotelName != null) settings.hotelName = req.hotelName;
        if (req.taxRate != null) settings.taxRate = req.taxRate;
        if (req.currency != null) settings.currency = req.currency;
        if (req.breakfastPrice != null) settings.breakfastPrice = req.breakfastPrice;
        if (req.minNights != null) settings.minNights = req.minNights;
        if (req.maxNights != null) settings.maxNights = req.maxNights;
        if (req.maxGuestsPerBooking != null) settings.maxGuestsPerBooking = req.maxGuestsPerBooking;
        if (req.checkInTime != null) settings.checkInTime = req.checkInTime;
        if (req.checkOutTime != null) settings.checkOutTime = req.checkOutTime;

        settings.persist();

        return Response.ok(settings).build();
    }
}