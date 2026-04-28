package com.hotel.inventory.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "housekeeping_tasks")
public class HousekeepingTask extends PanacheEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    public Room room;

    @Column(name = "assigned_to")
    public UUID assignedTo; // The STAFF user ID

    @Column(length = 255)
    public String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public TaskStatus status = TaskStatus.PENDING;

    public enum TaskStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }

    public static HousekeepingTask findActiveTaskByRoom(Long roomId) {
        return find("room.id = ?1 and status != ?2", roomId, TaskStatus.COMPLETED).firstResult();
    }
}