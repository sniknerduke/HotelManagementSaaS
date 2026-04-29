package com.hotel.inventory.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
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

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt;

    @Column(name = "completed_at")
    public Instant completedAt;

    @PrePersist
    void onPersist() {
        createdAt = Instant.now();
    }

    public enum TaskStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }

    // --- Finders ---

    public static HousekeepingTask findActiveTaskByRoom(Long roomId) {
        return find("room.id = ?1 and status != ?2", roomId, TaskStatus.COMPLETED).firstResult();
    }

    public static List<HousekeepingTask> findByStatus(TaskStatus status) {
        return list("status", status);
    }

    public static List<HousekeepingTask> findActiveTasks() {
        return list("status != ?1", TaskStatus.COMPLETED);
    }

    public static List<HousekeepingTask> findByAssignee(UUID staffId) {
        return list("assignedTo = ?1 and status != ?2", staffId, TaskStatus.COMPLETED);
    }
}