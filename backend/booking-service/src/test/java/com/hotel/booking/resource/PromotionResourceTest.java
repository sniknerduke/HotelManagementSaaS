package com.hotel.booking.resource;

import com.hotel.booking.entity.Promotion;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;
import com.hotel.booking.NoAuthTestProfile;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import java.math.BigDecimal;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
@TestProfile(NoAuthTestProfile.class)
@TestSecurity(user = "admin@test.com", roles = {"ADMIN", "MANAGER"})
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PromotionResourceTest {

    private static Integer createdPromotionId;

    @Test
    @Order(1)
    void testCreatePromotion() {
        createdPromotionId = given()
            .contentType(ContentType.JSON)
            .body("""
                {
                    "code": "SUMMER20",
                    "discountPercentage": 20.0,
                    "active": true
                }
                """)
            .when().post("/api/promotions")
            .then()
            .statusCode(201)
            .body("code", equalTo("SUMMER20"))
            .body("discountPercentage", equalTo(20.0F))
            .body("active", equalTo(true))
            .extract().path("id");
    }

    @Test
    @Order(2)
    void testCreateDuplicatePromotion() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {
                    "code": "SUMMER20",
                    "discountPercentage": 10.0,
                    "active": true
                }
                """)
            .when().post("/api/promotions")
            .then()
            .statusCode(409);
    }

    @Test
    @Order(3)
    @TestSecurity(user = "guest", roles = {})
    void testValidatePromotion() {
        given()
            .when().get("/api/promotions/validate/SUMMER20")
            .then()
            .statusCode(200)
            .body("discountPercentage", equalTo(20.0F));
    }

    @Test
    @Order(4)
    @TestSecurity(user = "guest", roles = {})
    void testValidateInvalidPromotion() {
        given()
            .when().get("/api/promotions/validate/UNKNOWN")
            .then()
            .statusCode(404);
    }

    @Test
    @Order(5)
    void testUpdatePromotion() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {
                    "code": "SUMMER25",
                    "discountPercentage": 25.0,
                    "active": false
                }
                """)
            .when().put("/api/promotions/" + createdPromotionId)
            .then()
            .statusCode(200)
            .body("code", equalTo("SUMMER25"))
            .body("discountPercentage", equalTo(25.0F))
            .body("active", equalTo(false));
    }

    @Test
    @Order(6)
    @TestSecurity(user = "guest", roles = {})
    void testValidateInactivePromotion() {
        given()
            .when().get("/api/promotions/validate/SUMMER25")
            .then()
            .statusCode(404);
    }

    @Test
    @Order(7)
    void testGetAllPromotions() {
        given()
            .when().get("/api/promotions")
            .then()
            .statusCode(200)
            .body("size()", greaterThanOrEqualTo(1));
    }
}