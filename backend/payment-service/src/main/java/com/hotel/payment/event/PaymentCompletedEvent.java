package com.hotel.payment.event;

public record PaymentCompletedEvent(Long reservationId, String transactionId, String status) {
}
