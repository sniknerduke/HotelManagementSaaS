package com.hotel.booking.service;

import com.hotel.booking.client.InventoryClient;
import com.hotel.booking.entity.Reservation;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
public class AnalyticsService {

    @Inject
    @RestClient
    InventoryClient inventoryClient;

    public AnalyticsOverview getOverview() {
        long totalBookings = Reservation.count();
        BigDecimal totalRevenue = Reservation.<Reservation>listAll().stream()
                .filter(r -> r.status != Reservation.ReservationStatus.CANCELLED && r.status != Reservation.ReservationStatus.NO_SHOW)
                .map(r -> r.totalPrice != null ? r.totalPrice : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long activeBookings = Reservation.count("status in ?1",
                List.of(Reservation.ReservationStatus.CONFIRMED, Reservation.ReservationStatus.CHECKED_IN));

        // Get total rooms for occupancy calculations (fallback to 1 if empty to avoid div by zero)
        int totalRooms = 1;
        try {
            List<InventoryClient.RoomDTO> rooms = inventoryClient.getAllRooms(null, null, null);
            if (rooms != null && !rooms.isEmpty()) {
                totalRooms = rooms.size();
            }
        } catch (Exception e) {
            // Ignore if inventory service is unreachable
        }

        // Occupancy calculation for last 30 days
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<Reservation> recentReservations = Reservation.list("checkInDate >= ?1 and status != 'CANCELLED'", thirtyDaysAgo);

        long totalOccupiedRoomNights = 0;
        for (Reservation r : recentReservations) {
            long nights = ChronoUnit.DAYS.between(r.checkInDate, r.checkOutDate);
            totalOccupiedRoomNights += Math.max(1, nights); // At least 1 night
        }

        double occupancyRate = 0;
        BigDecimal adr = BigDecimal.ZERO;
        BigDecimal revPar = BigDecimal.ZERO;

        if (totalRooms > 0) {
            long totalAvailableRoomNights = totalRooms * 30L;
            if (totalAvailableRoomNights > 0) {
                occupancyRate = ((double) totalOccupiedRoomNights / totalAvailableRoomNights) * 100;
            }
        }

        if (totalOccupiedRoomNights > 0) {
            BigDecimal recentRevenue = recentReservations.stream()
                    .map(r -> r.totalPrice != null ? r.totalPrice : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            adr = recentRevenue.divide(BigDecimal.valueOf(totalOccupiedRoomNights), 2, RoundingMode.HALF_UP);
        }

        if (totalRooms > 0) {
            revPar = adr.multiply(BigDecimal.valueOf(occupancyRate / 100)).setScale(2, RoundingMode.HALF_UP);
        }

        return new AnalyticsOverview(totalRevenue, totalBookings, occupancyRate, adr, revPar);
    }

    public List<ChartMetric> getBookings(String period) {
        int days = parsePeriod(period);
        LocalDate startDate = LocalDate.now().minusDays(days);
        
        List<Reservation> reservations = Reservation.list("checkInDate >= ?1", startDate);
        
        Map<LocalDate, Long> counts = reservations.stream()
                .collect(Collectors.groupingBy(r -> r.checkInDate, Collectors.counting()));
                
        return generateDailyMetrics(startDate, days, counts);
    }

    public List<ChartMetric> getRevenue(String period) {
        int days = parsePeriod(period);
        LocalDate startDate = LocalDate.now().minusDays(days);
        
        List<Reservation> reservations = Reservation.list("checkInDate >= ?1 and status != 'CANCELLED'", startDate);
        
        Map<LocalDate, Double> revenueMap = reservations.stream()
                .collect(Collectors.toMap(
                        r -> r.checkInDate,
                        r -> r.totalPrice != null ? r.totalPrice.doubleValue() : 0.0,
                        Double::sum
                ));
                
        return generateDailyMetrics(startDate, days, revenueMap);
    }

    public List<ChartMetric> getOccupancy() {
        int days = 30; // Default to 30 days for occupancy chart
        LocalDate startDate = LocalDate.now().minusDays(days);
        
        List<Reservation> reservations = Reservation.list("checkInDate >= ?1 and status != 'CANCELLED'", startDate);
        
        int totalRooms = 1;
        try {
            List<InventoryClient.RoomDTO> rooms = inventoryClient.getAllRooms(null, null, null);
            if (rooms != null && !rooms.isEmpty()) {
                totalRooms = rooms.size();
            }
        } catch (Exception e) {
            totalRooms = 100; // Mock fallback
        }
        
        Map<LocalDate, Double> dailyOccupancy = new HashMap<>();
        
        for (int i = 0; i <= days; i++) {
            LocalDate date = startDate.plusDays(i);
            long occupiedRooms = reservations.stream()
                    .filter(r -> !date.isBefore(r.checkInDate) && date.isBefore(r.checkOutDate))
                    .count();
            
            double rate = ((double) occupiedRooms / totalRooms) * 100;
            dailyOccupancy.put(date, rate);
        }
        
        return generateDailyMetrics(startDate, days, dailyOccupancy);
    }

    public TodayStats getTodayStats() {
        LocalDate today = LocalDate.now();
        
        long arrivals = Reservation.count("checkInDate = ?1 and status != 'CANCELLED'", today);
        long departures = Reservation.count("checkOutDate = ?1 and status != 'CANCELLED'", today);
        long inHouse = Reservation.count("checkInDate <= ?1 and checkOutDate > ?1 and status in ('CHECKED_IN')", today);
        
        return new TodayStats(arrivals, departures, inHouse);
    }

    private int parsePeriod(String period) {
        if ("7d".equalsIgnoreCase(period)) return 7;
        if ("90d".equalsIgnoreCase(period)) return 90;
        return 30; // default 30d
    }

    private <T extends Number> List<ChartMetric> generateDailyMetrics(LocalDate startDate, int days, Map<LocalDate, T> data) {
        List<ChartMetric> result = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        
        for (int i = 0; i <= days; i++) {
            LocalDate date = startDate.plusDays(i);
            Number value = data.containsKey(date) ? data.get(date) : 0;
            result.add(new ChartMetric(date.format(formatter), value));
        }
        
        return result;
    }

    // --- DTOs ---

    public record AnalyticsOverview(BigDecimal totalRevenue, long totalBookings, double occupancyRate, BigDecimal adr, BigDecimal revPar) {}
    public record ChartMetric(String date, Number value) {}
    public record TodayStats(long arrivals, long departures, long inHouseGuests) {}
}