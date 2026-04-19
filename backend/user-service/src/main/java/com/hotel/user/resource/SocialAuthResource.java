package com.hotel.user.resource;

import com.hotel.user.entity.User;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.net.URI;
import java.util.UUID;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
public class SocialAuthResource {

    @ConfigProperty(name = "QUARKUS_OIDC_GOOGLE_CLIENT_ID")
    String googleClientId;

    @ConfigProperty(name = "QUARKUS_OIDC_FACEBOOK_CLIENT_ID")
    String facebookClientId;

    private static final String FRONTEND_OAUTH_CALLBACK = "http://localhost:5173/oauth/callback";

    // --- GOOGLE OAUTH ---

    @GET
    @Path("/google")
    public Response loginWithGoogle() {
        String redirectUri = "http://localhost:8000/api/auth/google/callback";
        String googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + googleClientId +
                "&redirect_uri=" + redirectUri +
                "&response_type=code" +
                "&scope=email%20profile%20openid";
                
        return Response.temporaryRedirect(URI.create(googleAuthUrl)).build();
    }

    @GET
    @Path("/google/callback")
    @Transactional
    public Response googleCallback(@QueryParam("code") String code) {
        // Validate OAuth token via external HTTP API...
        // For demo: create or query the user based on payload email
        String googleEmail = "vip.google.user@example.com";
        String googleFirst = "Guest";
        String googleLast = "(Google)";

        User user = User.findByEmail(googleEmail);
        if (user == null) {
            user = new User();
            user.email = googleEmail;
            user.firstName = googleFirst;
            user.lastName = googleLast;
            user.passwordHash = UUID.randomUUID().toString(); // Random string, no valid password for OAuth users
            user.role = User.UserRole.GUEST;
            user.persist();
        }

        // Mock JWT parsing/generation
        String generatedToken = "jwt_token_from_google_sso";

        // Dispatch user back to the React app handling tokens via URL
        URI targetUri = URI.create(FRONTEND_OAUTH_CALLBACK + "?token=" + generatedToken + "&userId=" + user.id);
        return Response.temporaryRedirect(targetUri).build();
    }


    // --- FACEBOOK OAUTH ---

    @GET
    @Path("/facebook")
    public Response loginWithFacebook() {
        String redirectUri = "http://localhost:8000/api/auth/facebook/callback";
        String facebookAuthUrl = "https://www.facebook.com/v18.0/dialog/oauth" +
                "?client_id=" + facebookClientId +
                "&redirect_uri=" + redirectUri +
                "&scope=email,public_profile";
                
        return Response.temporaryRedirect(URI.create(facebookAuthUrl)).build();
    }

    @GET
    @Path("/facebook/callback")
    @Transactional
    public Response facebookCallback(@QueryParam("code") String code) {
        // Validate Facebook Token...
        String fbEmail = "vip.facebook.user@example.com";
        String fbFirst = "Guest";
        String fbLast = "(Facebook)";

        User user = User.findByEmail(fbEmail);
        if (user == null) {
            user = new User();
            user.email = fbEmail;
            user.firstName = fbFirst;
            user.lastName = fbLast;
            user.passwordHash = UUID.randomUUID().toString();
            user.role = User.UserRole.GUEST;
            user.persist();
        }

        String generatedToken = "jwt_token_from_facebook_sso";
        
        URI targetUri = URI.create(FRONTEND_OAUTH_CALLBACK + "?token=" + generatedToken + "&userId=" + user.id);
        return Response.temporaryRedirect(targetUri).build();
    }
}
