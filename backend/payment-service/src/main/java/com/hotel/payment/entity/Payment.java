package com.hotel.payment.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments")
public class Payment extends PanacheEntity {

    @Column(name = "reservation_id", nullable = false)
    public Long reservationId;

    @Column(nullable = false, precision = 10, scale = 2)
    public BigDecimal amount;

    @Column(name = "payment_method")
    public String paymentMethod;

    @Column(name = "transaction_id")
    public String transactionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "payment_date", nullable = false, updatable = false)
    public Instant paymentDate;

    @PrePersist
    void onPersist() {
        paymentDate = Instant.now();
    }

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }

    // --- Finders ---

    public static Payment findByReservationId(Long reservationId) {
        return find("reservationId", reservationId).firstResult();
    }
}
