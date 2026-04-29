package com.hotel.inventory.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;
import com.hotel.inventory.NoAuthTestProfile;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for InventoryResource, HousekeepingResource, and SettingsResource.
 * Uses NoAuthTestProfile for H2 database.
 * Uses @TestSecurity at class level to simulate ADMIN role.
 */
@QuarkusTest
@TestProfile(NoAuthTestProfile.class)
@TestSecurity(user = "admin@test.com", roles = {"ADMIN", "STAFF"})
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class InventoryResourceTest {

    // ==================== SEED DATA (create room types and rooms) ====================

    @Test
    @Order(1)
    @DisplayName("POST /api/inventory/room-types - seed Standard Room type")
    void seedRoomTypeStandard() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "name": "Standard Room",
                        "description": "A cozy room with essential amenities.",
                        "basePrice": 100.00,
                        "maxGuests": 2,
                        "imageUrl": "/images/rooms/standard.jpg"
                    }
                """)
            .when()
                .post("/api/inventory/room-types")
            .then()
                .statusCode(201)
                .body("name", equalTo("Standard Room"));
    }

    @Test
    @Order(2)
    @DisplayName("POST /api/inventory/room-types - seed Deluxe Room type")
    void seedRoomTypeDeluxe() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "name": "Deluxe Room",
                        "description": "Spacious room with premium views.",
                        "basePrice": 150.00,
                        "maxGuests": 3,
                        "imageUrl": "/images/rooms/deluxe.jpg"
                    }
                """)
            .when()
                .post("/api/inventory/room-types")
            .then()
                .statusCode(201);
    }

    @Test
    @Order(3)
    @DisplayName("POST /api/inventory/rooms - seed rooms 101, 102, 103")
    void seedRooms() {
        // Use the first room type ID (from seed above)
        Integer roomTypeId = given()
            .when()
                .get("/api/inventory/room-types")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        // Room 101
        given()
                .contentType(ContentType.JSON)
                .body("{\"roomNumber\": \"101\", \"roomTypeId\": " + roomTypeId + "}")
            .when()
                .post("/api/inventory/rooms")
            .then()
                .statusCode(201);

        // Room 102
        given()
                .contentType(ContentType.JSON)
                .body("{\"roomNumber\": \"102\", \"roomTypeId\": " + roomTypeId + "}")
            .when()
                .post("/api/inventory/rooms")
            .then()
                .statusCode(201);

        // Room 103
        given()
                .contentType(ContentType.JSON)
                .body("{\"roomNumber\": \"103\", \"roomTypeId\": " + roomTypeId + "}")
            .when()
                .post("/api/inventory/rooms")
            .then()
                .statusCode(201);
    }

    // ==================== ROOM TYPES ====================

    @Test
    @Order(10)
    @DisplayName("GET /api/inventory/room-types - list all room types")
    void testGetRoomTypes() {
        given()
            .when()
                .get("/api/inventory/room-types")
            .then()
                .statusCode(200)
                .body("size()", equalTo(2))
                .body("[0].name", notNullValue())
                .body("[0].basePrice", notNullValue())
                .body("[0].availableCount", notNullValue());
    }

    @Test
    @Order(11)
    @DisplayName("GET /api/inventory/room-types/{id} - get single room type")
    void testGetRoomTypeById() {
        Integer id = given()
            .when()
                .get("/api/inventory/room-types")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        given()
            .when()
                .get("/api/inventory/room-types/" + id)
            .then()
                .statusCode(200)
                .body("name", equalTo("Standard Room"));
    }

    @Test
    @Order(12)
    @DisplayName("PUT /api/inventory/room-types/{id} - update room type")
    void testUpdateRoomType() {
        Integer id = given()
            .when()
                .get("/api/inventory/room-types")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "name": "Standard Room Plus",
                        "description": "Updated description",
                        "basePrice": 120.00,
                        "maxGuests": 3,
                        "imageUrl": "/images/rooms/standard-plus.jpg"
                    }
                """)
            .when()
                .put("/api/inventory/room-types/" + id)
            .then()
                .statusCode(200)
                .body("name", equalTo("Standard Room Plus"))
                .body("basePrice", equalTo(120.00f))
                .body("maxGuests", equalTo(3));
    }

    @Test
    @Order(13)
    @DisplayName("POST /api/inventory/room-types - create new room type")
    void testCreateRoomType() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "name": "Presidential Suite",
                        "description": "Top floor suite with private terrace",
                        "basePrice": 500.00,
                        "maxGuests": 6,
                        "imageUrl": "/images/rooms/presidential.jpg"
                    }
                """)
            .when()
                .post("/api/inventory/room-types")
            .then()
                .statusCode(201)
                .body("name", equalTo("Presidential Suite"))
                .body("availableCount", equalTo(0));
    }

    // ==================== ROOMS ====================

    @Test
    @Order(20)
    @DisplayName("GET /api/inventory/rooms - list all rooms")
    void testGetAllRooms() {
        given()
            .when()
                .get("/api/inventory/rooms")
            .then()
                .statusCode(200)
                .body("size()", greaterThanOrEqualTo(3));
    }

    @Test
    @Order(21)
    @DisplayName("GET /api/inventory/rooms?status=AVAILABLE - filter by status")
    void testGetRoomsByStatus() {
        given()
                .queryParam("status", "AVAILABLE")
            .when()
                .get("/api/inventory/rooms")
            .then()
                .statusCode(200)
                .body("size()", greaterThanOrEqualTo(1))
                .body("status", everyItem(equalTo("AVAILABLE")));
    }

    @Test
    @Order(22)
    @DisplayName("GET /api/inventory/rooms/{id} - get single room")
    void testGetRoomById() {
        Integer roomId = given()
            .when()
                .get("/api/inventory/rooms")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        given()
            .when()
                .get("/api/inventory/rooms/" + roomId)
            .then()
                .statusCode(200)
                .body("id", equalTo(roomId))
                .body("roomNumber", notNullValue());
    }

    @Test
    @Order(23)
    @DisplayName("GET /api/inventory/rooms/{id} - not found returns 404")
    void testGetRoomNotFound() {
        given()
            .when()
                .get("/api/inventory/rooms/9999")
            .then()
                .statusCode(404);
    }

    @Test
    @Order(24)
    @DisplayName("PUT /api/inventory/rooms/{id} - update room")
    void testUpdateRoom() {
        Integer roomId = given()
            .when()
                .get("/api/inventory/rooms")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "floor": 4,
                        "status": "MAINTENANCE"
                    }
                """)
            .when()
                .put("/api/inventory/rooms/" + roomId)
            .then()
                .statusCode(200)
                .body("floor", equalTo(4))
                .body("status", equalTo("MAINTENANCE"));
    }

    @Test
    @Order(25)
    @DisplayName("PATCH /api/inventory/rooms/{id}/status - update room status")
    void testUpdateRoomStatus() {
        Integer roomId = given()
            .when()
                .get("/api/inventory/rooms")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        given()
                .contentType(ContentType.JSON)
                .body("""
                    { "status": "AVAILABLE" }
                """)
            .when()
                .patch("/api/inventory/rooms/" + roomId + "/status")
            .then()
                .statusCode(200)
                .body("status", equalTo("AVAILABLE"));
    }

    @Test
    @Order(26)
    @DisplayName("PATCH /api/inventory/rooms/{id}/status - invalid status returns 400")
    void testUpdateRoomStatusInvalid() {
        Integer roomId = given()
            .when()
                .get("/api/inventory/rooms")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        given()
                .contentType(ContentType.JSON)
                .body("""
                    { "status": "NONEXISTENT" }
                """)
            .when()
                .patch("/api/inventory/rooms/" + roomId + "/status")
            .then()
                .statusCode(400)
                .body("error", containsString("Invalid status"));
    }

    @Test
    @Order(27)
    @DisplayName("DELETE /api/inventory/rooms/{id} - soft delete room")
    void testDeleteRoom() {
        // Get the last room
        Integer roomId = given()
            .when()
                .get("/api/inventory/rooms")
            .then()
                .statusCode(200)
            .extract()
                .path("[-1].id");

        given()
            .when()
                .delete("/api/inventory/rooms/" + roomId)
            .then()
                .statusCode(204);

        // Verify it was set to OUT_OF_ORDER (soft delete)
        given()
            .when()
                .get("/api/inventory/rooms/" + roomId)
            .then()
                .statusCode(200)
                .body("status", equalTo("OUT_OF_ORDER"));
    }

    // ==================== AVAILABILITY ====================

    @Test
    @Order(30)
    @DisplayName("GET /api/inventory/rooms/availability - check availability")
    void testCheckAvailability() {
        given()
                .queryParam("checkIn", "2026-12-01")
                .queryParam("checkOut", "2026-12-05")
                .queryParam("guests", 2)
            .when()
                .get("/api/inventory/rooms/availability")
            .then()
                .statusCode(200)
                .body("size()", greaterThanOrEqualTo(1));
    }

    // ==================== ROOM TYPE DELETE ====================

    @Test
    @Order(35)
    @DisplayName("DELETE /api/inventory/room-types/{id} - cannot delete type with rooms")
    void testDeleteRoomTypeWithAttachedRooms() {
        Integer id = given()
            .when()
                .get("/api/inventory/room-types")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        given()
            .when()
                .delete("/api/inventory/room-types/" + id)
            .then()
                .statusCode(400)
                .body("error", containsString("attached rooms"));
    }

    // ==================== SETTINGS ====================

    @Test
    @Order(40)
    @DisplayName("GET /api/settings - get hotel settings (auto-creates if empty)")
    void testGetSettings() {
        given()
            .when()
                .get("/api/settings")
            .then()
                .statusCode(200)
                .body("hotelName", notNullValue())
                .body("currency", notNullValue())
                .body("checkInTime", notNullValue())
                .body("checkOutTime", notNullValue());
    }

    @Test
    @Order(41)
    @DisplayName("PUT /api/settings - update hotel settings")
    void testUpdateSettings() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "hotelName": "Lumière Grand Resort",
                        "taxRate": 10.00,
                        "breakfastPrice": 30.00
                    }
                """)
            .when()
                .put("/api/settings")
            .then()
                .statusCode(200)
                .body("hotelName", equalTo("Lumière Grand Resort"))
                .body("taxRate", equalTo(10.00f))
                .body("breakfastPrice", equalTo(30.00f))
                // Unchanged fields should remain
                .body("currency", equalTo("USD"));
    }

    // ==================== HOUSEKEEPING ====================

    @Test
    @Order(50)
    @DisplayName("GET /api/housekeeping/tasks - initially empty")
    void testGetHousekeepingTasksEmpty() {
        given()
            .when()
                .get("/api/housekeeping/tasks")
            .then()
                .statusCode(200);
    }

    @Test
    @Order(51)
    @DisplayName("POST /api/housekeeping/tasks - create task")
    void testCreateHousekeepingTask() {
        Integer roomId = given()
            .when()
                .get("/api/inventory/rooms")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        given()
                .contentType(ContentType.JSON)
                .body("{\"roomId\": " + roomId + ", \"notes\": \"Deep cleaning requested\"}")
            .when()
                .post("/api/housekeeping/tasks")
            .then()
                .statusCode(201)
                .body("roomId", equalTo(roomId))
                .body("status", equalTo("PENDING"))
                .body("notes", equalTo("Deep cleaning requested"));
    }

    @Test
    @Order(52)
    @DisplayName("POST /api/housekeeping/tasks - duplicate task for same room returns 409")
    void testCreateDuplicateHousekeepingTask() {
        Integer roomId = given()
            .when()
                .get("/api/inventory/rooms")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        given()
                .contentType(ContentType.JSON)
                .body("{\"roomId\": " + roomId + ", \"notes\": \"Another task\"}")
            .when()
                .post("/api/housekeeping/tasks")
            .then()
                .statusCode(409)
                .body("error", containsString("already exists"));
    }

    @Test
    @Order(53)
    @DisplayName("PATCH /api/housekeeping/tasks/{id}/status - mark in progress")
    void testUpdateTaskStatusToInProgress() {
        Integer taskId = given()
            .when()
                .get("/api/housekeeping/tasks")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        given()
                .contentType(ContentType.JSON)
                .body("""
                    { "status": "IN_PROGRESS" }
                """)
            .when()
                .patch("/api/housekeeping/tasks/" + taskId + "/status")
            .then()
                .statusCode(200)
                .body("status", equalTo("IN_PROGRESS"));
    }

    @Test
    @Order(54)
    @DisplayName("PATCH /api/housekeeping/tasks/{id}/status - mark completed")
    void testUpdateTaskStatusToCompleted() {
        Integer taskId = given()
            .when()
                .get("/api/housekeeping/tasks")
            .then()
                .statusCode(200)
            .extract()
                .path("[0].id");

        given()
                .contentType(ContentType.JSON)
                .body("""
                    { "status": "COMPLETED" }
                """)
            .when()
                .patch("/api/housekeeping/tasks/" + taskId + "/status")
            .then()
                .statusCode(200)
                .body("status", equalTo("COMPLETED"))
                .body("completedAt", notNullValue());
    }
}
