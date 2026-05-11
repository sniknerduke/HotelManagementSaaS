package com.hotel.booking.event;

public record PaymentCompletedEvent(Long reservationId, String transactionId, String status) {
}
