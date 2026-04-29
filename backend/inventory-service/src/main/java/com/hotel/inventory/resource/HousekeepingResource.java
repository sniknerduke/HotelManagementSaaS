package com.hotel.inventory.resource;

import com.hotel.inventory.entity.HousekeepingTask;
import com.hotel.inventory.entity.HousekeepingTask.TaskStatus;
import com.hotel.inventory.entity.Room;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Path("/api/housekeeping")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HousekeepingResource {

    // --- DTOs ---

    public record TaskResponse(Long id, Long roomId, String roomNumber, UUID assignedTo,
                               String notes, String status, Instant createdAt, Instant completedAt) {
        public static TaskResponse from(HousekeepingTask task) {
            return new TaskResponse(
                    task.id,
                    task.room != null ? task.room.id : null,
                    task.room != null ? task.room.roomNumber : null,
                    task.assignedTo,
                    task.notes,
                    task.status.name(),
                    task.createdAt,
                    task.completedAt
            );
        }
    }

    public record CreateTaskRequest(
            @NotNull(message = "Room ID is required") Long roomId,
            UUID assignedTo,
            String notes) {}

    public record UpdateTaskStatusRequest(
            @NotBlank(message = "Status is required") String status) {}

    public record AssignTaskRequest(
            @NotNull(message = "Staff user ID is required") UUID assignedTo) {}

    // --- Endpoints ---

    /**
     * List housekeeping tasks. Defaults to active (non-completed) tasks.
     * Optional filters: ?status=PENDING&assignedTo=<uuid>
     */
    @GET
    @Path("/tasks")
    @RolesAllowed({"ADMIN", "STAFF"})
    public Response getTasks(
            @QueryParam("status") TaskStatus status,
            @QueryParam("assignedTo") UUID assignedTo) {

        List<HousekeepingTask> tasks;

        if (status != null && assignedTo != null) {
            tasks = HousekeepingTask.list("status = ?1 and assignedTo = ?2", status, assignedTo);
        } else if (status != null) {
            tasks = HousekeepingTask.findByStatus(status);
        } else if (assignedTo != null) {
            tasks = HousekeepingTask.findByAssignee(assignedTo);
        } else {
            tasks = HousekeepingTask.findActiveTasks();
        }

        List<TaskResponse> result = tasks.stream()
                .map(TaskResponse::from)
                .toList();

        return Response.ok(result).build();
    }

    /**
     * Create a housekeeping task manually (e.g., for maintenance or special cleaning).
     * Auto-created tasks happen in BookingResource.checkOut().
     */
    @POST
    @Path("/tasks")
    @RolesAllowed({"ADMIN", "STAFF"})
    @Transactional
    public Response createTask(@Valid CreateTaskRequest req) {
        Room room = Room.findById(req.roomId());
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Room not found\"}")
                    .build();
        }

        // Check if there's already an active task for this room
        HousekeepingTask existing = HousekeepingTask.findActiveTaskByRoom(req.roomId());
        if (existing != null) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"An active housekeeping task already exists for this room\"}")
                    .build();
        }

        HousekeepingTask task = new HousekeepingTask();
        task.room = room;
        task.assignedTo = req.assignedTo();
        task.notes = req.notes();
        task.persist();

        // Set room status to DIRTY if it isn't already in a cleaning state
        if (room.status == Room.RoomStatus.AVAILABLE || room.status == Room.RoomStatus.OCCUPIED) {
            room.status = Room.RoomStatus.DIRTY;
        }

        return Response.status(Response.Status.CREATED)
                .entity(TaskResponse.from(task))
                .build();
    }

    /**
     * Update task status: PENDING → IN_PROGRESS → COMPLETED.
     * When marked COMPLETED, automatically sets the room to AVAILABLE.
     */
    @PATCH
    @Path("/tasks/{id}/status")
    @RolesAllowed({"ADMIN", "STAFF"})
    @Transactional
    public Response updateTaskStatus(@PathParam("id") Long id, @Valid UpdateTaskStatusRequest req) {
        HousekeepingTask task = HousekeepingTask.findById(id);
        if (task == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        TaskStatus newStatus;
        try {
            newStatus = TaskStatus.valueOf(req.status().toUpperCase());
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Invalid status: " + req.status() + ". Valid: PENDING, IN_PROGRESS, COMPLETED\"}")
                    .build();
        }

        task.status = newStatus;

        // Update room status based on task status
        if (newStatus == TaskStatus.IN_PROGRESS) {
            task.room.status = Room.RoomStatus.CLEANING;
        } else if (newStatus == TaskStatus.COMPLETED) {
            task.completedAt = Instant.now();
            task.room.status = Room.RoomStatus.AVAILABLE;
        }

        return Response.ok(TaskResponse.from(task)).build();
    }

    /**
     * Assign or reassign a staff member to a task.
     */
    @PATCH
    @Path("/tasks/{id}/assign")
    @RolesAllowed("ADMIN")
    @Transactional
    public Response assignTask(@PathParam("id") Long id, @Valid AssignTaskRequest req) {
        HousekeepingTask task = HousekeepingTask.findById(id);
        if (task == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        task.assignedTo = req.assignedTo();
        return Response.ok(TaskResponse.from(task)).build();
    }
}