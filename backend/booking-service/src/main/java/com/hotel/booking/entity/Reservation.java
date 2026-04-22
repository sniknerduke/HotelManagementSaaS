package com.hotel.booking.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "reservations")
public class Reservation extends PanacheEntity {

    @Column(name = "user_id", nullable = false)
    public UUID userId;

    @Column(name = "room_id", nullable = false)
    public Long roomId;

    @Column(name = "check_in_date", nullable = false)
    public LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    public LocalDate checkOutDate;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    public BigDecimal totalPrice;

    @Column(name = "adult_count")
    public Integer adultCount = 1;

    @Column(name = "child_count")
    public Integer childCount = 0;

    @Column(name = "guest_notes", length = 500)
    public String guestNotes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public ReservationStatus status = ReservationStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt;

    @PrePersist
    void onPersist() {
        createdAt = Instant.now();
    }

    public enum ReservationStatus {
        PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW
    }

    // --- Finders ---

    public static List<Reservation> findByUserId(UUID userId) {
        return list("userId", userId);
    }
}
