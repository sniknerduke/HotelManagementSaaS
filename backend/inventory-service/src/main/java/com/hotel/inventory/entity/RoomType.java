package com.hotel.inventory.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "room_types")
public class RoomType extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    public BigDecimal basePrice;

    @Column(name = "max_guests", nullable = false)
    public int maxGuests;

    @Column(name = "image_url", columnDefinition = "TEXT")
    public String imageUrl;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "roomType", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Room> rooms;
}
