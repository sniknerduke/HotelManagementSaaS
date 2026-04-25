package com.hotel.user.service;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.util.UUID;
import com.hotel.user.entity.User.UserRole;

@ApplicationScoped
public class JwtService {

    public String generateToken(UUID userId, String email, UserRole role) {
        return Jwt.issuer("https://lumiere.com/issuer")
                  .upn(email)
                  .groups(role.name())
                  .claim("userId", userId.toString())
                  .expiresIn(Duration.ofHours(24))
                  .sign();
    }
}
