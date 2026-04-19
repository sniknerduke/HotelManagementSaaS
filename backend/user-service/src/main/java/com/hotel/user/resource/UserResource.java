package com.hotel.user.resource;

import com.hotel.user.entity.User;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.UUID;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    // --- DTOs ---

    public record RegisterRequest(String email, String password, String firstName, String lastName) {}
    public record LoginRequest(String email, String password) {}
    public record UserResponse(UUID id, String email, String firstName, String lastName, String role) {
        public static UserResponse from(User u) {
            return new UserResponse(u.id, u.email, u.firstName, u.lastName, u.role.name());
        }
    }

    // --- Endpoints ---

    @POST
    @Path("/register")
    @Transactional
    public Response register(RegisterRequest req) {
        if (User.findByEmail(req.email()) != null) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"Email already registered\"}")
                    .build();
        }

        User user = new User();
        user.email = req.email();
        // TODO: Replace with proper BCrypt hashing (e.g. quarkus-elytron-security)
        user.passwordHash = req.password();
        user.firstName = req.firstName();
        user.lastName = req.lastName();
        user.persist();

        return Response.status(Response.Status.CREATED)
                .entity(UserResponse.from(user))
                .build();
    }

    @POST
    @Path("/login")
    public Response login(LoginRequest req) {
        User user = User.findByEmail(req.email());
        if (user == null || !user.passwordHash.equals(req.password())) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Invalid credentials\"}")
                    .build();
        }
        // TODO: Generate and return JWT token
        return Response.ok()
                .entity("{\"message\": \"Login successful\", \"userId\": \"" + user.id + "\"}")
                .build();
    }

    @GET
    @Path("/{id}")
    public Response getUser(@PathParam("id") UUID id) {
        User user = User.findById(id);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(UserResponse.from(user)).build();
    }
}
