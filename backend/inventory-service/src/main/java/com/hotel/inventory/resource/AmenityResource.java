package com.hotel.inventory.resource;

import com.hotel.inventory.entity.Amenity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/inventory/amenities")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AmenityResource {

    public record AmenityRequest(
            @NotBlank(message = "Name is required") String name,
            String description,
            String icon) {}

    @GET
    public Response getAllAmenities() {
        return Response.ok(Amenity.listAll()).build();
    }

    @POST
    @Transactional
    @RolesAllowed({"ADMIN", "MANAGER"})
    public Response createAmenity(@Valid AmenityRequest req) {
        Amenity amenity = new Amenity();
        amenity.name = req.name();
        amenity.description = req.description();
        amenity.icon = req.icon();
        amenity.persist();
        return Response.status(Response.Status.CREATED).entity(amenity).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed({"ADMIN", "MANAGER"})
    public Response updateAmenity(@PathParam("id") Long id, @Valid AmenityRequest req) {
        Amenity amenity = Amenity.findById(id);
        if (amenity == null) return Response.status(Response.Status.NOT_FOUND).build();
        amenity.name = req.name();
        amenity.description = req.description();
        amenity.icon = req.icon();
        return Response.ok(amenity).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed({"ADMIN", "MANAGER"})
    public Response deleteAmenity(@PathParam("id") Long id) {
        boolean deleted = Amenity.deleteById(id);
        if (!deleted) return Response.status(Response.Status.NOT_FOUND).build();
        return Response.noContent().build();
    }
}
