package com.hotel.user.resource;

import com.hotel.user.entity.User;
import com.hotel.user.service.JwtService;
import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.UUID;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    JwtService jwtService;

    @Inject
    com.hotel.user.service.MailService mailService;

    // --- DTOs ---

    public record RegisterRequest(
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email, 
            @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters") String password, 
            @NotBlank(message = "First name is required") String firstName, 
            @NotBlank(message = "Last name is required") String lastName, 
            @NotBlank(message = "Phone number is required") String phoneNumber) {}

    public record LoginRequest(
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email, 
            @NotBlank(message = "Password is required") String password) {}

    public record ForgotPasswordRequest(
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email) {}

    public record ResetPasswordRequest(
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
            @NotBlank(message = "OTP is required") String otp,
            @NotBlank(message = "New password is required") @Size(min = 6, message = "New password must be at least 6 characters") String newPassword) {}

    public record NewsletterRequest(
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email) {}

    public record UpdateProfileRequest(
            String firstName, 
            String lastName, 
            String phoneNumber, 
            String nationality, 
            @Size(min = 9, max = 12, message = "National ID must be between 9 and 12 characters") String nationalId, 
            @Past(message = "Date of birth must be in the past") java.time.LocalDate dateOfBirth, 
            @Size(max = 255, message = "Address length must be less than 255") String address, 
            String avatarUrl) {}

    public record UpdateRoleRequest(
            @NotBlank(message = "Role is required") String role) {}

    public record ChangePasswordRequest(
            @NotBlank(message = "Current password is required") String currentPassword, 
            @NotBlank(message = "New password is required") @Size(min = 6, message = "New password must be at least 6 characters") String newPassword) {}

    public record UserResponse(UUID id, String email, String firstName, String lastName, String role, String phoneNumber,
                               String nationality, String nationalId, java.time.LocalDate dateOfBirth, String address, String avatarUrl, boolean isActive) {
        public static UserResponse from(User u) {
            return new UserResponse(u.id, u.email, u.firstName, u.lastName, u.role.name(), u.phoneNumber,
                    u.nationality, u.nationalId, u.dateOfBirth, u.address, u.avatarUrl, u.isActive);
        }
    }

    // --- Endpoints ---

    @GET
    @RolesAllowed("ADMIN")
    public Response getAllUsers() {
        return Response.ok(User.<User>list("isActive = true").stream().map(UserResponse::from).toList()).build();
    }

    @POST
    @Path("/register")
    @PermitAll
    @Transactional
    public Response register(@Valid RegisterRequest req) {
        if (User.findByEmail(req.email()) != null) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"Email already registered\"}")
                    .build();
        }

        User user = new User();
        user.email = req.email();
        user.passwordHash = BcryptUtil.bcryptHash(req.password());
        user.firstName = req.firstName();
        user.lastName = req.lastName();
        user.phoneNumber = req.phoneNumber();
        user.persist();

        return Response.status(Response.Status.CREATED)
                .entity(UserResponse.from(user))
                .build();
    }

    @POST
    @Path("/login")
    @PermitAll
    public Response login(@Valid LoginRequest req) {
        User user = User.findByEmail(req.email());
        if (user == null || !BcryptUtil.matches(req.password(), user.passwordHash)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Invalid credentials\"}")
                    .build();
        }
        
        String token = jwtService.generateToken(user.id, user.email, user.role);
        
        return Response.ok()
                .entity("{\"message\": \"Login successful\", \"token\": \"" + token + "\", \"userId\": \"" + user.id + "\"}")
                .build();
    }

    @POST
    @Path("/forgot-password")
    @PermitAll
    @Transactional
    public Response forgotPassword(@Valid ForgotPasswordRequest req) {
        User user = User.findByEmail(req.email());
        if (user != null && user.isActive) {
            String otp = String.format("%06d", new java.util.Random().nextInt(999999));
            user.resetPasswordOtp = otp;
            user.resetPasswordExpires = java.time.Instant.now().plus(java.time.Duration.ofMinutes(15));
            mailService.sendForgotPasswordEmail(user.email, otp);
        }
        // Always return 200 OK to prevent email enumeration attacks
        return Response.ok("{\"message\": \"If an active account with that email exists, an OTP has been sent.\"}").build();
    }

    @POST
    @Path("/reset-password")
    @PermitAll
    @Transactional
    public Response resetPassword(@Valid ResetPasswordRequest req) {
        User user = User.findByEmail(req.email());
        if (user == null || !user.isActive) {
             return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\": \"Invalid request.\"}").build();
        }
        if (user.resetPasswordOtp == null || !user.resetPasswordOtp.equals(req.otp()) || user.resetPasswordExpires.isBefore(java.time.Instant.now())) {
             return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\": \"Invalid or expired OTP.\"}").build();
        }
        
        user.passwordHash = io.quarkus.elytron.security.common.BcryptUtil.bcryptHash(req.newPassword());
        user.resetPasswordOtp = null;
        user.resetPasswordExpires = null;
        return Response.ok("{\"message\": \"Password reset successfully.\"}").build();
    }

    @POST
    @Path("/newsletter")
    @PermitAll
    public Response subscribeNewsletter(@Valid NewsletterRequest req) {
        mailService.sendNewsletterWelcome(req.email());
        return Response.ok("{\"message\": \"Successfully subscribed to the newsletter\"}").build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"GUEST", "STAFF", "ADMIN"})
    public Response getUser(@PathParam("id") UUID id) {
        User user = User.findById(id);
        if (user == null || !user.isActive) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(UserResponse.from(user)).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"GUEST", "STAFF", "ADMIN"})
    @Transactional
    public Response updateProfile(@PathParam("id") UUID id, @Valid UpdateProfileRequest req) {
        User user = User.findById(id);
        if (user == null || !user.isActive) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (req.firstName() != null) user.firstName = req.firstName();
        if (req.lastName() != null) user.lastName = req.lastName();
        if (req.phoneNumber() != null) user.phoneNumber = req.phoneNumber();
        if (req.nationality() != null) user.nationality = req.nationality();
        if (req.nationalId() != null) user.nationalId = req.nationalId();
        if (req.dateOfBirth() != null) user.dateOfBirth = req.dateOfBirth();
        if (req.address() != null) user.address = req.address();
        if (req.avatarUrl() != null) user.avatarUrl = req.avatarUrl();

        return Response.ok(UserResponse.from(user)).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response deactivateAccount(@PathParam("id") UUID id) {
        User user = User.findById(id);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        user.isActive = false;
        return Response.noContent().build();
    }

    @PATCH
    @Path("/{id}/role")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response changeRole(@PathParam("id") UUID id, @Valid UpdateRoleRequest req) {
        User user = User.findById(id);
        if (user == null || !user.isActive) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        try {
            user.role = User.UserRole.valueOf(req.role());
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Invalid role: " + req.role() + "\"}")
                    .build();
        }

        return Response.ok(UserResponse.from(user)).build();
    }

    @PUT
    @Path("/{id}/password")
    @RolesAllowed({"GUEST", "STAFF", "ADMIN"})
    @Transactional
    public Response changePassword(@PathParam("id") UUID id, @Valid ChangePasswordRequest req) {
        User user = User.findById(id);
        if (user == null || !user.isActive) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (!BcryptUtil.matches(req.currentPassword(), user.passwordHash)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Incorrect current password\"}")
                    .build();
        }

        user.passwordHash = BcryptUtil.bcryptHash(req.newPassword());

        return Response.ok("{\"message\": \"Password updated successfully\"}").build();
    }

    @POST
    @Path("/logout")
    @RolesAllowed({"GUEST", "STAFF", "ADMIN"})
    public Response logout() {
        return Response.ok("{\"message\": \"Logged out successfully\"}").build();
    }
}
