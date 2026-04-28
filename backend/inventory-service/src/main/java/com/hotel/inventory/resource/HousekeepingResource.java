package com.hotel.inventory.resource;

import com.hotel.inventory.entity.HousekeepingTask;
import com.hotel.inventory.entity.Room;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;

@Path("/api/housekeeping")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HousekeepingResource {

    public record HousekeepingTaskResponse(Long id, Long roomId, String roomNumber, String roomStatus, UUID assignedTo, String taskStatus, String notes) {
        public static HousekeepingTaskResponse from(HousekeepingTask task) {
            return new HousekeepingTaskResponse(
                    task.id,
                    task.room != null ? task.room.id : null,
                    task.room != null ? task.room.roomNumber : null,
                    task.room != null ? task.room.status.name() : null,
                    task.assignedTo,
                    task.status.name(),
                    task.notes
            );
        }
    }

    public record RoomStatusDTO(Long roomId, String roomNumber, String status) {
        public static RoomStatusDTO from(Room room) {
            return new RoomStatusDTO(room.id, room.roomNumber, room.status.name());
        }
    }

    public record AssignTaskRequest(UUID staffId, String notes) {}
    public record UpdateRoomStatusRequest(String status) {}

    @GET
    @Path("/tasks")
    @RolesAllowed({"ADMIN", "STAFF"})
    public Response getPendingTasks() {
        // List rooms where status = DIRTY or CLEANING
        List<Room> rooms = Room.list("status in ?1", List.of(Room.RoomStatus.DIRTY, Room.RoomStatus.CLEANING));
        List<RoomStatusDTO> result = rooms.stream().map(RoomStatusDTO::from).toList();
        return Response.ok(result).build();
    }

    @PATCH
    @Path("/rooms/{id}/status")
    @RolesAllowed({"ADMIN", "STAFF"})
    @Transactional
    public Response updateRoomCleaningStatus(@PathParam("id") Long id, UpdateRoomStatusRequest req) {
        Room room = Room.findById(id);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        try {
            Room.RoomStatus newStatus = Room.RoomStatus.valueOf(req.status().toUpperCase());
            room.status = newStatus;
            
            // If marked as CLEAN or INSPECTED, and there's a task, mark it as COMPLETED
            if (newStatus == Room.RoomStatus.CLEAN || newStatus == Room.RoomStatus.INSPECTED || newStatus == Room.RoomStatus.AVAILABLE) {
                HousekeepingTask activeTask = HousekeepingTask.findActiveTaskByRoom(id);
                if (activeTask != null) {
                    activeTask.status = HousekeepingTask.TaskStatus.COMPLETED;
                }
            }
            
            return Response.ok(RoomStatusDTO.from(room)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Invalid status\"}").build();
        }
    }

    @POST
    @Path("/rooms/{id}/assign")
    @RolesAllowed({"ADMIN", "STAFF"})
    @Transactional
    public Response assignStaffToRoom(@PathParam("id") Long roomId, AssignTaskRequest req) {
        Room room = Room.findById(roomId);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        HousekeepingTask task = HousekeepingTask.findActiveTaskByRoom(roomId);
        if (task == null) {
            task = new HousekeepingTask();
            task.room = room;
            task.status = HousekeepingTask.TaskStatus.PENDING;
        }
        
        task.assignedTo = req.staffId();
        if (req.notes() != null) {
            task.notes = req.notes();
        }
        task.persist();
        
        // Also update room status to CLEANING if currently DIRTY and being assigned
        if (room.status == Room.RoomStatus.DIRTY) {
            room.status = Room.RoomStatus.CLEANING;
        }

        return Response.ok(HousekeepingTaskResponse.from(task)).build();
    }

    @GET
    @Path("/assignments")
    @RolesAllowed({"ADMIN", "STAFF"})
    public Response getAllAssignments() {
        List<HousekeepingTask> tasks = HousekeepingTask.listAll();
        List<HousekeepingTaskResponse> result = tasks.stream().map(HousekeepingTaskResponse::from).toList();
        return Response.ok(result).build();
    }
}