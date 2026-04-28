-- Seed data for user-service
-- Passwords: admin123 and guest123 (BCrypt hashed)
-- BCrypt hash for 'admin123': $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- BCrypt hash for 'guest123': $2a$10$dXJ3SW6G7P50lGmMQgel6uNXK.d0nLSOeaRH7j0Y2e.bkNlqQEfWO

INSERT INTO users (id, email, password_hash, first_name, last_name, phone_number, role, is_active, created_at)
VALUES ('11111111-1111-1111-1111-111111111111', 'admin@lumiere.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'Admin', 'User', '+1234567890', 'ADMIN', true, CURRENT_TIMESTAMP);

INSERT INTO users (id, email, password_hash, first_name, last_name, phone_number, role, is_active, created_at)
VALUES ('22222222-2222-2222-2222-222222222222', 'guest@lumiere.com',
        '$2a$10$dXJ3SW6G7P50lGmMQgel6uNXK.d0nLSOeaRH7j0Y2e.bkNlqQEfWO',
        'Guest', 'User', '+0987654321', 'GUEST', true, CURRENT_TIMESTAMP);
