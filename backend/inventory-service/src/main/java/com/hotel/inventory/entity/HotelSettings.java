package com.hotel.inventory.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "hotel_settings")
public class HotelSettings extends PanacheEntity {

    @Column(name = "hotel_name")
    public String hotelName = "Lumière Hotel & Resort";

    @Column(name = "tax_rate", precision = 5, scale = 2)
    public BigDecimal taxRate = new BigDecimal("8.50");

    public String currency = "USD";

    @Column(name = "breakfast_price", precision = 10, scale = 2)
    public BigDecimal breakfastPrice = new BigDecimal("25.00");

    @Column(name = "min_nights")
    public Integer minNights = 1;

    @Column(name = "max_nights")
    public Integer maxNights = 30;

    @Column(name = "max_guests_per_booking")
    public Integer maxGuestsPerBooking = 8;

    @Column(name = "check_in_time")
    public String checkInTime = "14:00";

    @Column(name = "check_out_time")
    public String checkOutTime = "11:00";
    
    public static HotelSettings getSettings() {
        HotelSettings settings = findById(1L);
        if (settings == null) {
            settings = new HotelSettings();
            settings.id = 1L;
            settings.persist();
        }
        return settings;
    }
}