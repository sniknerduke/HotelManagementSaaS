package com.hotel.inventory.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room extends PanacheEntity {

    @Column(name = "room_number", unique = true, nullable = false)
    public String roomNumber;

    @Column(name = "floor")
    public Integer floor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    public RoomType roomType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public RoomStatus status = RoomStatus.AVAILABLE;

    public enum RoomStatus {
        AVAILABLE, OCCUPIED, CLEANING, MAINTENANCE, OUT_OF_ORDER, DIRTY, CLEAN, INSPECTED
    }

    // --- Finders ---

    public static long countAvailableByType(Long roomTypeId) {
        return count("roomType.id = ?1 and status = ?2", roomTypeId, RoomStatus.AVAILABLE);
    }
}
