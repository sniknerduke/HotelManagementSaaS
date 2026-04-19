package com.hotel.inventory.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room extends PanacheEntity {

    @Column(name = "room_number", unique = true, nullable = false)
    public String roomNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    public RoomType roomType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public RoomStatus status = RoomStatus.AVAILABLE;

    public enum RoomStatus {
        AVAILABLE, MAINTENANCE
    }

    // --- Finders ---

    public static long countAvailableByType(Long roomTypeId) {
        return count("roomType.id = ?1 and status = ?2", roomTypeId, RoomStatus.AVAILABLE);
    }
}
