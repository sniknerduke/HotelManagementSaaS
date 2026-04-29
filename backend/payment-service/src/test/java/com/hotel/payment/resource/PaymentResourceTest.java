package com.hotel.payment.resource;

import com.hotel.payment.client.BookingClient;
import com.hotel.payment.vnpay.VNPayService;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;
import io.quarkus.test.InjectMock;
import com.hotel.payment.NoAuthTestProfile;
import io.restassured.http.ContentType;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;

/**
 * Integration tests for PaymentResource.
 * Uses NoAuthTestProfile for H2 database.
 * Mocks BookingClient and VNPayService since external services won't be running.
 */
@QuarkusTest
@TestProfile(NoAuthTestProfile.class)
@TestSecurity(user = "admin@test.com", roles = {"ADMIN", "STAFF"})
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PaymentResourceTest {

    @InjectMock
    @RestClient
    BookingClient bookingClient;

    @InjectMock
    VNPayService vnPayService;

    private static Integer createdPaymentId;

    @BeforeEach
    void setupMocks() {
        // Mock: booking status update succeeds
        Mockito.when(bookingClient.updateBookingStatus(any(), any()))
                .thenReturn(new BookingClient.BookingDTO(1L, "CONFIRMED"));

        // Mock: VNPay createOrder returns a payment URL (third param 'urlReturn' can be null)
        Mockito.when(vnPayService.createOrder(anyLong(), any(), any(), any(), any()))
                .thenReturn("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?fake=params");
    }

    // ==================== CREATE PAYMENT ====================

    @Test
    @Order(1)
    @DisplayName("POST /api/payments - credit card payment success")
    void testCreateCreditCardPayment() {
        createdPaymentId = given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "reservationId": 1,
                        "paymentMethod": "CREDIT_CARD",
                        "amount": 400.00
                    }
                """)
            .when()
                .post("/api/payments")
            .then()
                .statusCode(200)
                .body("reservationId", equalTo(1))
                .body("amount", equalTo(400.00f))
                .body("paymentMethod", equalTo("CREDIT_CARD"))
                .body("status", equalTo("COMPLETED"))
                .body("transactionId", notNullValue())
                .body("id", notNullValue())
            .extract()
                .path("id");
    }

    @Test
    @Order(2)
    @DisplayName("POST /api/payments - VNPay payment returns pending with URL")
    void testCreateVNPayPayment() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "reservationId": 2,
                        "paymentMethod": "VNPAY",
                        "amount": 500.00
                    }
                """)
            .when()
                .post("/api/payments")
            .then()
                .statusCode(200)
                .body("status", equalTo("PENDING"))
                .body("paymentUrl", notNullValue())
                .body("paymentUrl", containsString("vnpay"));
    }

    @Test
    @Order(3)
    @DisplayName("POST /api/payments - missing fields returns 400")
    void testCreatePaymentMissingFields() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "reservationId": null,
                        "paymentMethod": "",
                        "amount": -10
                    }
                """)
            .when()
                .post("/api/payments")
            .then()
                .statusCode(400);
    }

    // ==================== GET PAYMENT ====================

    @Test
    @Order(4)
    @DisplayName("GET /api/payments/{id} - success")
    void testGetPaymentById() {
        given()
            .when()
                .get("/api/payments/" + createdPaymentId)
            .then()
                .statusCode(200)
                .body("id", equalTo(createdPaymentId))
                .body("status", equalTo("COMPLETED"));
    }

    @Test
    @Order(5)
    @DisplayName("GET /api/payments/{id} - not found returns 404")
    void testGetPaymentNotFound() {
        given()
            .when()
                .get("/api/payments/9999")
            .then()
                .statusCode(404);
    }

    @Test
    @Order(6)
    @DisplayName("GET /api/payments/reservation/{id} - get by reservation")
    void testGetPaymentByReservation() {
        given()
            .when()
                .get("/api/payments/reservation/1")
            .then()
                .statusCode(200)
                .body("reservationId", equalTo(1));
    }

    @Test
    @Order(7)
    @DisplayName("GET /api/payments/reservation/{id} - not found returns 404")
    void testGetPaymentByReservationNotFound() {
        given()
            .when()
                .get("/api/payments/reservation/9999")
            .then()
                .statusCode(404);
    }

    // ==================== LIST ALL PAYMENTS ====================

    @Test
    @Order(8)
    @DisplayName("GET /api/payments - list all payments")
    void testGetAllPayments() {
        given()
            .when()
                .get("/api/payments")
            .then()
                .statusCode(200)
                .body("size()", greaterThanOrEqualTo(1));
    }

    @Test
    @Order(9)
    @DisplayName("GET /api/payments?status=COMPLETED - filter by status")
    void testGetPaymentsFilteredByStatus() {
        given()
                .queryParam("status", "COMPLETED")
            .when()
                .get("/api/payments")
            .then()
                .statusCode(200)
                .body("size()", greaterThanOrEqualTo(1))
                .body("status", everyItem(equalTo("COMPLETED")));
    }

    // ==================== REFUND ====================

    @Test
    @Order(10)
    @DisplayName("POST /api/payments/{id}/refund - success")
    void testRefundPayment() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "amount": 400.00
                    }
                """)
            .when()
                .post("/api/payments/" + createdPaymentId + "/refund")
            .then()
                .statusCode(200)
                .body("status", equalTo("REFUNDED"));
    }

    @Test
    @Order(11)
    @DisplayName("POST /api/payments/{id}/refund - already refunded returns 400")
    void testRefundAlreadyRefundedPayment() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "amount": 400.00
                    }
                """)
            .when()
                .post("/api/payments/" + createdPaymentId + "/refund")
            .then()
                .statusCode(400)
                .body("error", containsString("Only completed payments"));
    }

    @Test
    @Order(12)
    @DisplayName("POST /api/payments/{id}/refund - not found returns 404")
    void testRefundNotFound() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {
                        "amount": 100.00
                    }
                """)
            .when()
                .post("/api/payments/9999/refund")
            .then()
                .statusCode(404);
    }
}
