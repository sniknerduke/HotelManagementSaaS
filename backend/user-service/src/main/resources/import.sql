INSERT INTO users (id, email, password_hash, first_name, last_name, phone_number, role, created_at)
VALUES ('11111111-1111-1111-1111-111111111111', 'admin@lumiere.com', '$2a$10$placeholder_hash_admin', 'Admin', 'User', '+1234567890', 'ADMIN', CURRENT_TIMESTAMP);

INSERT INTO users (id, email, password_hash, first_name, last_name, phone_number, role, created_at)
VALUES ('22222222-2222-2222-2222-222222222222', 'guest@lumiere.com', '$2a$10$placeholder_hash_guest', 'Guest', 'User', '+0987654321', 'GUEST', CURRENT_TIMESTAMP);
