package com.hotel.inventory.resource;

import com.hotel.inventory.entity.HotelSettings;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;

@Path("/api/settings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SettingsResource {

    // --- DTO ---

    public record SettingsResponse(Long id, String hotelName, BigDecimal taxRate, String currency,
                                   BigDecimal breakfastPrice, Integer minNights, Integer maxNights,
                                   Integer maxGuestsPerBooking, String checkInTime, String checkOutTime) {
        public static SettingsResponse from(HotelSettings s) {
            return new SettingsResponse(s.id, s.hotelName, s.taxRate, s.currency,
                    s.breakfastPrice, s.minNights, s.maxNights,
                    s.maxGuestsPerBooking, s.checkInTime, s.checkOutTime);
        }
    }

    public record UpdateSettingsRequest(
            String hotelName,
            BigDecimal taxRate,
            String currency,
            BigDecimal breakfastPrice,
            Integer minNights,
            Integer maxNights,
            Integer maxGuestsPerBooking,
            String checkInTime,
            String checkOutTime) {}

    // --- Endpoints ---

    /**
     * Get current hotel settings. Public so frontend can read check-in/check-out times, etc.
     */
    @GET
    @PermitAll
    @Transactional
    public Response getSettings() {
        HotelSettings settings = HotelSettings.getSettings();
        return Response.ok(SettingsResponse.from(settings)).build();
    }

    /**
     * Update hotel settings. Admin only.
     */
    @PUT
    @RolesAllowed("ADMIN")
    @Transactional
    public Response updateSettings(UpdateSettingsRequest req) {
        HotelSettings settings = HotelSettings.getSettings();

        if (req.hotelName() != null) settings.hotelName = req.hotelName();
        if (req.taxRate() != null) settings.taxRate = req.taxRate();
        if (req.currency() != null) settings.currency = req.currency();
        if (req.breakfastPrice() != null) settings.breakfastPrice = req.breakfastPrice();
        if (req.minNights() != null) settings.minNights = req.minNights();
        if (req.maxNights() != null) settings.maxNights = req.maxNights();
        if (req.maxGuestsPerBooking() != null) settings.maxGuestsPerBooking = req.maxGuestsPerBooking();
        if (req.checkInTime() != null) settings.checkInTime = req.checkInTime();
        if (req.checkOutTime() != null) settings.checkOutTime = req.checkOutTime();

        return Response.ok(SettingsResponse.from(settings)).build();
    }
}