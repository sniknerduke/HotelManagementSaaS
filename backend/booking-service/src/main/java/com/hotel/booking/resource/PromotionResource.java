package com.hotel.booking.resource;

import com.hotel.booking.entity.Promotion;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.util.List;

@Path("/api/promotions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PromotionResource {

    public record PromotionRequest(
            @NotBlank(message = "Promotion code is required") String code,
            @NotNull(message = "Discount percentage is required")
            @Positive(message = "Discount must be positive")
            @DecimalMax(value = "100", message = "Discount cannot exceed 100%") BigDecimal discountPercentage,
            boolean active) {}

    @GET
    @PermitAll
    public List<Promotion> getAllPromotions() {
        return Promotion.listAll();
    }

    @GET
    @Path("/validate/{code}")
    @PermitAll
    public Response validatePromotion(@PathParam("code") String code) {
        Promotion promo = Promotion.findByCode(code);
        if (promo == null || !promo.active) {
            return Response.status(Response.Status.NOT_FOUND).entity("Invalid or inactive promotion code").build();
        }
        return Response.ok(promo).build();
    }

    @POST
    @RolesAllowed({"ADMIN", "MANAGER"})
    @Transactional
    public Response createPromotion(@Valid PromotionRequest request) {
        if (Promotion.findByCode(request.code()) != null) {
            return Response.status(Response.Status.CONFLICT).entity("Promotion code already exists").build();
        }
        Promotion promo = new Promotion();
        promo.code = request.code();
        promo.discountPercentage = request.discountPercentage();
        promo.active = request.active();
        promo.persist();
        return Response.status(Response.Status.CREATED).entity(promo).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"ADMIN", "MANAGER"})
    @Transactional
    public Response updatePromotion(@PathParam("id") Long id, @Valid PromotionRequest request) {
        Promotion promo = Promotion.findById(id);
        if (promo == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        // Check if another promotion already uses this code
        Promotion existing = Promotion.findByCode(request.code());
        if (existing != null && !existing.id.equals(promo.id)) {
            return Response.status(Response.Status.CONFLICT).entity("Promotion code already exists").build();
        }
        promo.code = request.code();
        promo.discountPercentage = request.discountPercentage();
        promo.active = request.active();
        return Response.ok(promo).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"ADMIN", "MANAGER"})
    @Transactional
    public Response deletePromotion(@PathParam("id") Long id) {
        Promotion promo = Promotion.findById(id);
        if (promo == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        promo.delete();
        return Response.noContent().build();
    }
}
