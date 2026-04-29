-- Seed data for inventory-service
-- Room types with image_url included
INSERT INTO room_types (id, name, description, base_price, max_guests, image_url) VALUES
(1, 'Standard Room', 'A cozy room with essential amenities for a comfortable stay.', 100.00, 2, '/images/rooms/standard.jpg'),
(2, 'Deluxe Room', 'Spacious room with premium views and upgraded furnishings.', 150.00, 3, '/images/rooms/deluxe.jpg'),
(3, 'Executive Suite', 'Luxurious suite featuring a separate living area, panoramic views, and exclusive services.', 250.00, 4, '/images/rooms/suite.jpg');

-- Standard Rooms (floor 1)
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (1, '101', 1, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (2, '102', 1, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (3, '103', 1, 'OCCUPIED', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (4, '104', 1, 'DIRTY', 1);

-- Deluxe Rooms (floor 2)
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (5, '201', 2, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (6, '202', 2, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (7, '203', 2, 'MAINTENANCE', 2);

-- Suites (floor 3)
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (8, '301', 3, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (9, '302', 3, 'OCCUPIED', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (10, '303', 3, 'OUT_OF_ORDER', 3);

-- Hotel Settings (singleton row)
INSERT INTO hotel_settings (id, hotel_name, tax_rate, currency, breakfast_price, min_nights, max_nights, max_guests_per_booking, check_in_time, check_out_time) VALUES
(1, 'Lumière Hotel & Resort', 8.50, 'USD', 25.00, 1, 30, 8, '14:00', '11:00');

-- Sample housekeeping task for room 104 (DIRTY)
INSERT INTO housekeeping_tasks (id, room_id, status, notes, created_at) VALUES
(1, 4, 'PENDING', 'Guest checked out, standard cleaning needed', '2026-04-29T06:00:00Z');

-- Reset sequences to avoid ID collision with auto-generated IDs
ALTER SEQUENCE room_types_seq RESTART WITH 100;
ALTER SEQUENCE rooms_seq RESTART WITH 100;
ALTER SEQUENCE hotel_settings_seq RESTART WITH 100;
ALTER SEQUENCE housekeeping_tasks_seq RESTART WITH 100;
