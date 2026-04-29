package com.hotel.user.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;
import com.hotel.user.NoAuthTestProfile;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for UserResource.
 * Uses NoAuthTestProfile for H2 database.
 * Uses @TestSecurity to simulate authenticated users for @RolesAllowed endpoints.
 */
@QuarkusTest
@TestProfile(NoAuthTestProfile.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserResourceTest {

    private static String registeredUserId;

    // ==================== REGISTER (PermitAll) ====================

    @Test
    @Order(1)
    @DisplayName("POST /api/users/register - success")
    void testRegisterSuccess() {
        registeredUserId = given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "email": "test@example.com",
                        "password": "secret123",
                        "firstName": "John",
                        "lastName": "Doe",
                        "phoneNumber": "+1234567890"
                    }
                """)
            .when()
                .post("/api/users/register")
            .then()
                .statusCode(201)
                .body("email", equalTo("test@example.com"))
                .body("firstName", equalTo("John"))
                .body("lastName", equalTo("Doe"))
                .body("role", equalTo("GUEST"))
                .body("isActive", equalTo(true))
                .body("id", notNullValue())
            .extract()
                .path("id");
    }

    @Test
    @Order(2)
    @DisplayName("POST /api/users/register - duplicate email returns 409")
    void testRegisterDuplicateEmail() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "email": "test@example.com",
                        "password": "another123",
                        "firstName": "Jane",
                        "lastName": "Doe",
                        "phoneNumber": "+9876543210"
                    }
                """)
            .when()
                .post("/api/users/register")
            .then()
                .statusCode(409)
                .body("error", containsString("already registered"));
    }

    @Test
    @Order(3)
    @DisplayName("POST /api/users/register - invalid email returns 400")
    void testRegisterInvalidEmail() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "email": "not-an-email",
                        "password": "secret123",
                        "firstName": "Bad",
                        "lastName": "User",
                        "phoneNumber": "+111"
                    }
                """)
            .when()
                .post("/api/users/register")
            .then()
                .statusCode(400);
    }

    // ==================== LOGIN (PermitAll) ====================

    @Test
    @Order(4)
    @DisplayName("POST /api/users/login - success")
    void testLoginSuccess() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "email": "test@example.com",
                        "password": "secret123"
                    }
                """)
            .when()
                .post("/api/users/login")
            .then()
                .statusCode(200)
                .body("token", notNullValue())
                .body("userId", notNullValue());
    }

    @Test
    @Order(5)
    @DisplayName("POST /api/users/login - wrong password returns 401")
    void testLoginWrongPassword() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "email": "test@example.com",
                        "password": "wrongpassword"
                    }
                """)
            .when()
                .post("/api/users/login")
            .then()
                .statusCode(401)
                .body("error", containsString("Invalid credentials"));
    }

    @Test
    @Order(6)
    @DisplayName("POST /api/users/login - non-existent user returns 401")
    void testLoginNonExistentUser() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "email": "nobody@example.com",
                        "password": "secret123"
                    }
                """)
            .when()
                .post("/api/users/login")
            .then()
                .statusCode(401);
    }

    // ==================== GET USER (RolesAllowed) ====================

    @Test
    @Order(7)
    @TestSecurity(user = "test@example.com", roles = "GUEST")
    @DisplayName("GET /api/users/{id} - success")
    void testGetUserById() {
        given()
            .when()
                .get("/api/users/" + registeredUserId)
            .then()
                .statusCode(200)
                .body("email", equalTo("test@example.com"))
                .body("firstName", equalTo("John"));
    }

    @Test
    @Order(8)
    @TestSecurity(user = "test@example.com", roles = "GUEST")
    @DisplayName("GET /api/users/{id} - not found returns 404")
    void testGetUserNotFound() {
        given()
            .when()
                .get("/api/users/00000000-0000-0000-0000-000000000000")
            .then()
                .statusCode(404);
    }

    // ==================== UPDATE PROFILE (RolesAllowed) ====================

    @Test
    @Order(9)
    @TestSecurity(user = "test@example.com", roles = "ADMIN")
    @DisplayName("PUT /api/users/{id} - update profile")
    void testUpdateProfile() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "firstName": "Jonathan",
                        "nationality": "US",
                        "address": "123 Main St"
                    }
                """)
            .when()
                .put("/api/users/" + registeredUserId)
            .then()
                .statusCode(200)
                .body("firstName", equalTo("Jonathan"))
                .body("nationality", equalTo("US"))
                .body("address", equalTo("123 Main St"))
                // lastName should remain unchanged
                .body("lastName", equalTo("Doe"));
    }

    // ==================== CHANGE PASSWORD (RolesAllowed) ====================

    @Test
    @Order(10)
    @TestSecurity(user = "test@example.com", roles = "GUEST")
    @DisplayName("PUT /api/users/{id}/password - success")
    void testChangePasswordSuccess() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "currentPassword": "secret123",
                        "newPassword": "newsecret456"
                    }
                """)
            .when()
                .put("/api/users/" + registeredUserId + "/password")
            .then()
                .statusCode(200)
                .body("message", containsString("Password updated"));
    }

    @Test
    @Order(11)
    @TestSecurity(user = "test@example.com", roles = "GUEST")
    @DisplayName("PUT /api/users/{id}/password - wrong current password returns 401")
    void testChangePasswordWrongCurrent() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "currentPassword": "wrongoldpwd",
                        "newPassword": "doesntmatter"
                    }
                """)
            .when()
                .put("/api/users/" + registeredUserId + "/password")
            .then()
                .statusCode(401)
                .body("error", containsString("Incorrect current password"));
    }

    // ==================== LOGIN WITH NEW PASSWORD ====================

    @Test
    @Order(12)
    @DisplayName("POST /api/users/login - works with new password after change")
    void testLoginWithNewPassword() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "email": "test@example.com",
                        "password": "newsecret456"
                    }
                """)
            .when()
                .post("/api/users/login")
            .then()
                .statusCode(200)
                .body("token", notNullValue());
    }

    // ==================== DEACTIVATE (RolesAllowed ADMIN) ====================

    @Test
    @Order(13)
    @TestSecurity(user = "admin@example.com", roles = "ADMIN")
    @DisplayName("DELETE /api/users/{id} - deactivate account")
    void testDeactivateAccount() {
        given()
            .when()
                .delete("/api/users/" + registeredUserId)
            .then()
                .statusCode(204);
    }

    @Test
    @Order(14)
    @TestSecurity(user = "admin@example.com", roles = "ADMIN")
    @DisplayName("GET /api/users/{id} - deactivated user returns 404")
    void testGetDeactivatedUser() {
        given()
            .when()
                .get("/api/users/" + registeredUserId)
            .then()
                .statusCode(404);
    }

    // ==================== LOGOUT (RolesAllowed) ====================

    @Test
    @Order(15)
    @TestSecurity(user = "test@example.com", roles = "GUEST")
    @DisplayName("POST /api/users/logout - success")
    void testLogout() {
        given()
                .contentType(ContentType.JSON)
                .body("{}")
            .when()
                .post("/api/users/logout")
            .then()
                .statusCode(200)
                .body("message", containsString("Logged out"));
    }
}
