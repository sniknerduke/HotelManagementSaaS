package com.hotel.booking.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "promotions")
public class Promotion extends PanacheEntity {

    @Column(nullable = false, unique = true)
    public String code;

    @Column(name = "discount_percentage", nullable = false)
    public BigDecimal discountPercentage;

    @Column(nullable = false)
    public boolean active = true;
    
    public static Promotion findByCode(String code) {
        return find("code", code).firstResult();
    }
}
