package com.hotel.booking.resource;

import com.hotel.booking.client.InventoryClient;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;
import io.quarkus.test.InjectMock;
import com.hotel.booking.NoAuthTestProfile;
import io.restassured.http.ContentType;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

/**
 * Integration tests for BookingResource.
 * Uses NoAuthTestProfile for H2 database.
 * Mocks InventoryClient since inventory-service won't be running during tests.
 */
@QuarkusTest
@TestProfile(NoAuthTestProfile.class)
@TestSecurity(user = "admin@test.com", roles = {"ADMIN", "STAFF", "GUEST"})
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BookingResourceTest {

    @InjectMock
    @RestClient
    InventoryClient inventoryClient;

    private static Integer createdBookingId;

    @BeforeEach
    void setupMocks() {
        // Mock: room 1 is AVAILABLE
        Mockito.when(inventoryClient.getRoom(1L))
                .thenReturn(new InventoryClient.RoomDTO(1L, "101", "AVAILABLE"));

        // Mock: room 2 is OCCUPIED
        Mockito.when(inventoryClient.getRoom(2L))
                .thenReturn(new InventoryClient.RoomDTO(2L, "102", "OCCUPIED"));

        // Mock: updateRoomStatus always succeeds
        Mockito.when(inventoryClient.updateRoomStatus(any(), any()))
                .thenReturn(new InventoryClient.RoomDTO(1L, "101", "OCCUPIED"));
    }

    // ==================== CREATE BOOKING ====================

    @Test
    @Order(1)
    @DisplayName("POST /api/bookings - success")
    void testCreateBookingSuccess() {
        createdBookingId = given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "roomId": 1,
                        "userId": "00000000-0000-0000-0000-000000000001",
                        "checkInDate": "2026-12-01",
                        "checkOutDate": "2026-12-05",
                        "totalPrice": 400.00,
                        "adultCount": 2,
                        "childCount": 0
                    }
                """)
            .when()
                .post("/api/bookings")
            .then()
                .statusCode(201)
                .body("roomId", equalTo(1))
                .body("status", equalTo("PENDING"))
                .body("totalPrice", equalTo(400.00f))
                .body("adultCount", equalTo(2))
                .body("id", notNullValue())
            .extract()
                .path("id");
    }

    @Test
    @Order(2)
    @DisplayName("POST /api/bookings - room not available returns 400")
    void testCreateBookingRoomNotAvailable() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "roomId": 2,
                        "userId": "00000000-0000-0000-0000-000000000001",
                        "checkInDate": "2026-12-01",
                        "checkOutDate": "2026-12-05",
                        "totalPrice": 400.00,
                        "adultCount": 2,
                        "childCount": 0
                    }
                """)
            .when()
                .post("/api/bookings")
            .then()
                .statusCode(400)
                .body("error", containsString("not available"));
    }

    @Test
    @Order(3)
    @DisplayName("POST /api/bookings - checkout before checkin returns 400")
    void testCreateBookingInvalidDates() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "roomId": 1,
                        "userId": "00000000-0000-0000-0000-000000000001",
                        "checkInDate": "2026-12-10",
                        "checkOutDate": "2026-12-05",
                        "totalPrice": 400.00,
                        "adultCount": 2,
                        "childCount": 0
                    }
                """)
            .when()
                .post("/api/bookings")
            .then()
                .statusCode(400);
    }

    // ==================== GET BOOKING ====================

    @Test
    @Order(4)
    @DisplayName("GET /api/bookings/{id} - success")
    void testGetBookingById() {
        given()
            .when()
                .get("/api/bookings/" + createdBookingId)
            .then()
                .statusCode(200)
                .body("id", equalTo(createdBookingId))
                .body("status", equalTo("PENDING"));
    }

    @Test
    @Order(5)
    @DisplayName("GET /api/bookings/{id} - not found returns 404")
    void testGetBookingNotFound() {
        given()
            .when()
                .get("/api/bookings/9999")
            .then()
                .statusCode(404);
    }

    @Test
    @Order(6)
    @DisplayName("GET /api/bookings/user/{userId} - get user bookings")
    void testGetUserBookings() {
        given()
            .when()
                .get("/api/bookings/user/00000000-0000-0000-0000-000000000001")
            .then()
                .statusCode(200)
                .body("size()", greaterThanOrEqualTo(1));
    }

    // ==================== UPDATE BOOKING ====================

    @Test
    @Order(7)
    @DisplayName("PUT /api/bookings/{id} - update booking")
    void testUpdateBooking() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "adultCount": 3,
                        "guestNotes": "Late arrival, after 10 PM"
                    }
                """)
            .when()
                .put("/api/bookings/" + createdBookingId)
            .then()
                .statusCode(200)
                .body("adultCount", equalTo(3))
                .body("guestNotes", equalTo("Late arrival, after 10 PM"));
    }

    // ==================== STATUS TRANSITIONS ====================

    @Test
    @Order(8)
    @DisplayName("PATCH /api/bookings/{id}/status - update to CONFIRMED")
    void testUpdateStatusToConfirmed() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    { "status": "CONFIRMED" }
                """)
            .when()
                .patch("/api/bookings/" + createdBookingId + "/status")
            .then()
                .statusCode(200)
                .body("status", equalTo("CONFIRMED"));
    }

    @Test
    @Order(9)
    @DisplayName("PATCH /api/bookings/{id}/status - invalid status returns 400")
    void testUpdateStatusInvalid() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    { "status": "NONEXISTENT" }
                """)
            .when()
                .patch("/api/bookings/" + createdBookingId + "/status")
            .then()
                .statusCode(400);
    }

    // ==================== CHECK-IN / CHECK-OUT ====================

    @Test
    @Order(10)
    @DisplayName("POST /api/bookings/{id}/check-in - success")
    void testCheckIn() {
        given()
                .contentType(ContentType.JSON)
            .when()
                .post("/api/bookings/" + createdBookingId + "/check-in")
            .then()
                .statusCode(200)
                .body("status", equalTo("CHECKED_IN"));
    }

    @Test
    @Order(11)
    @DisplayName("POST /api/bookings/{id}/check-out - success")
    void testCheckOut() {
        // Re-setup mock for check-out (room goes to DIRTY)
        Mockito.when(inventoryClient.updateRoomStatus(any(), any()))
                .thenReturn(new InventoryClient.RoomDTO(1L, "101", "DIRTY"));

        given()
                .contentType(ContentType.JSON)
            .when()
                .post("/api/bookings/" + createdBookingId + "/check-out")
            .then()
                .statusCode(200)
                .body("status", equalTo("CHECKED_OUT"));
    }

    // ==================== CANCEL BOOKING ====================

    @Test
    @Order(20)
    @DisplayName("POST + DELETE - create and cancel booking")
    void testCancelBooking() {
        // Create a new booking to cancel
        Integer bookingId = given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "roomId": 1,
                        "userId": "00000000-0000-0000-0000-000000000002",
                        "checkInDate": "2027-01-10",
                        "checkOutDate": "2027-01-15",
                        "totalPrice": 500.00,
                        "adultCount": 1,
                        "childCount": 0
                    }
                """)
            .when()
                .post("/api/bookings")
            .then()
                .statusCode(201)
            .extract()
                .path("id");

        // Cancel it
        given()
            .when()
                .delete("/api/bookings/" + bookingId)
            .then()
                .statusCode(204);

        // Verify it's cancelled
        given()
            .when()
                .get("/api/bookings/" + bookingId)
            .then()
                .statusCode(200)
                .body("status", equalTo("CANCELLED"));
    }

    // ==================== GET ALL (Admin) ====================

    @Test
    @Order(30)
    @DisplayName("GET /api/bookings - list all bookings")
    void testGetAllBookings() {
        given()
            .when()
                .get("/api/bookings")
            .then()
                .statusCode(200)
                .body("size()", greaterThanOrEqualTo(1));
    }
}
