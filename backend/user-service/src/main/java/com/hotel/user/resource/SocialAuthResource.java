package com.hotel.user.resource;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.user.entity.User;
import com.hotel.user.service.JwtService;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
public class SocialAuthResource {

    @Inject
    JwtService jwtService;

    @ConfigProperty(name = "QUARKUS_OIDC_GOOGLE_CLIENT_ID", defaultValue = "")
    String googleClientId;

    @ConfigProperty(name = "QUARKUS_OIDC_GOOGLE_CLIENT_SECRET", defaultValue = "")
    String googleClientSecret;

    @ConfigProperty(name = "QUARKUS_OIDC_FACEBOOK_CLIENT_ID", defaultValue = "")
    String facebookClientId;

    @ConfigProperty(name = "QUARKUS_OIDC_FACEBOOK_CLIENT_SECRET", defaultValue = "")
    String facebookClientSecret;

    private static final String FRONTEND_OAUTH_CALLBACK = "http://localhost:5173/oauth/callback";
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    // --- GOOGLE OAUTH ---

    @GET
    @Path("/google")
    @PermitAll
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
    @PermitAll
    @Transactional
    public Response googleCallback(@QueryParam("code") String code) {
        if (code == null || code.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing authorization code").build();
        }
        
        try {
            String redirectUri = "http://localhost:8000/api/auth/google/callback";
            String tokenBody = "code=" + code +
                    "&client_id=" + googleClientId +
                    "&client_secret=" + googleClientSecret +
                    "&redirect_uri=" + redirectUri +
                    "&grant_type=authorization_code";

            // 1. Get Access Token
            HttpRequest tokenReq = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/token"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(tokenBody))
                    .build();

            HttpResponse<String> tokenRes = httpClient.send(tokenReq, HttpResponse.BodyHandlers.ofString());
            JsonNode tokenNode = mapper.readTree(tokenRes.body());
            
            if (!tokenNode.has("access_token")) {
                throw new RuntimeException("Failed to retrieve access token from Google: " + tokenRes.body());
            }
            String accessToken = tokenNode.get("access_token").asText();

            // 2. Fetch User Info
            HttpRequest userReq = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/oauth2/v2/userinfo"))
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();

            HttpResponse<String> userRes = httpClient.send(userReq, HttpResponse.BodyHandlers.ofString());
            JsonNode userNode = mapper.readTree(userRes.body());

            String email = userNode.has("email") ? userNode.get("email").asText() : userNode.get("id").asText() + "@google.com";
            String firstName = userNode.has("given_name") ? userNode.get("given_name").asText() : "Google User";
            String lastName = userNode.has("family_name") ? userNode.get("family_name").asText() : "";

            // 3. Keep to User DB
            User user = User.findByEmail(email);
            if (user == null) {
                user = new User();
                user.email = email;
                user.firstName = firstName;
                user.lastName = lastName;
                user.passwordHash = UUID.randomUUID().toString(); // Random secure placeholder
                user.role = User.UserRole.GUEST;
                user.persist();
            }

            // Real JWT Generation
            String generatedToken = jwtService.generateToken(user.id, user.email, user.role);

            return Response.temporaryRedirect(URI.create(FRONTEND_OAUTH_CALLBACK + "?token=" + generatedToken + "&userId=" + user.id)).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.temporaryRedirect(URI.create("http://localhost:5173/login?error=GoogleAuthFailed")).build();
        }
    }

    // --- FACEBOOK OAUTH ---

    @GET
    @Path("/facebook")
    @PermitAll
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
    @PermitAll
    @Transactional
    public Response facebookCallback(@QueryParam("code") String code) {
        if (code == null || code.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing authorization code").build();
        }
        
        try {
            // 1. Get Access Token
            String redirectUri = "http://localhost:8000/api/auth/facebook/callback";
            String tokenUrl = "https://graph.facebook.com/v18.0/oauth/access_token" +
                    "?client_id=" + facebookClientId +
                    "&redirect_uri=" + redirectUri +
                    "&client_secret=" + facebookClientSecret +
                    "&code=" + code;

            HttpRequest tokenReq = HttpRequest.newBuilder().uri(URI.create(tokenUrl)).GET().build();
            HttpResponse<String> tokenRes = httpClient.send(tokenReq, HttpResponse.BodyHandlers.ofString());
            JsonNode tokenNode = mapper.readTree(tokenRes.body());
            
            if (!tokenNode.has("access_token")) {
                throw new RuntimeException("Failed to retrieve access token from Facebook: " + tokenRes.body());
            }
            String accessToken = tokenNode.get("access_token").asText();

            // 2. Fetch User Profile
            String userUrl = "https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=" + accessToken;
            HttpRequest userReq = HttpRequest.newBuilder().uri(URI.create(userUrl)).GET().build();
            HttpResponse<String> userRes = httpClient.send(userReq, HttpResponse.BodyHandlers.ofString());
            JsonNode userNode = mapper.readTree(userRes.body());

            String email = userNode.has("email") ? userNode.get("email").asText() : userNode.get("id").asText() + "@facebook.com";
            String firstName = userNode.has("first_name") ? userNode.get("first_name").asText() : "Facebook User";
            String lastName = userNode.has("last_name") ? userNode.get("last_name").asText() : "";

            // 3. Keep to User DB
            User user = User.findByEmail(email);
            if (user == null) {
                user = new User();
                user.email = email;
                user.firstName = firstName;
                user.lastName = lastName;
                user.passwordHash = UUID.randomUUID().toString();
                user.role = User.UserRole.GUEST;
                user.persist();
            }

            // Real JWT Generation
            String generatedToken = jwtService.generateToken(user.id, user.email, user.role);

            return Response.temporaryRedirect(URI.create(FRONTEND_OAUTH_CALLBACK + "?token=" + generatedToken + "&userId=" + user.id)).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.temporaryRedirect(URI.create("http://localhost:5173/login?error=FacebookAuthFailed")).build();
        }
    }
}
