package com.hotel.booking.service;

import com.hotel.booking.entity.Reservation;
import com.hotel.booking.entity.Reservation.ReservationStatus;
import com.hotel.booking.client.InventoryClient;

import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@ApplicationScoped
public class ReservationCleanupService {

    private static final Logger LOG = Logger.getLogger(ReservationCleanupService.class);

    @Inject
    @RestClient
    InventoryClient inventoryClient;

    @Scheduled(every = "5m")
    @Transactional
    public void cleanupAbandonedBookings() {
        Instant threshold = Instant.now().minus(Duration.ofMinutes(15));
        List<Reservation> abandoned = Reservation.find("status = ?1 and createdAt < ?2", ReservationStatus.PENDING, threshold).list();
        
        for (Reservation r : abandoned) {
            r.status = ReservationStatus.CANCELLED;
            LOG.infof("Cancelled abandoned booking %d", r.id);
            try {
                inventoryClient.updateRoomStatus(r.roomId, new InventoryClient.UpdateStatusRequest("AVAILABLE"));
                LOG.infof("Restored room %d to AVAILABLE", r.roomId);
            } catch (Exception e) {
                LOG.errorf("Failed to update room status for room %d", r.roomId, e);
            }
        }
    }
}