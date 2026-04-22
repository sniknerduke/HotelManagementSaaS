package com.hotel.user.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;

    @Column(unique = true, nullable = false)
    public String email;

    @Column(name = "password_hash", nullable = false)
    public String passwordHash;

    @Column(name = "first_name", nullable = false)
    public String firstName;

    @Column(name = "last_name", nullable = false)
    public String lastName;

    @Column(name = "phone_number")
    public String phoneNumber;

    public String nationality;

    @Column(name = "national_id")
    public String nationalId;

    @Column(name = "date_of_birth")
    public java.time.LocalDate dateOfBirth;

    public String address;

    @Column(name = "avatar_url")
    public String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public UserRole role = UserRole.GUEST;

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt;

    @PrePersist
    void onPersist() {
        createdAt = Instant.now();
    }

    // --- Panache finder methods ---

    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }

    public enum UserRole {
        GUEST, STAFF, ADMIN
    }
}
