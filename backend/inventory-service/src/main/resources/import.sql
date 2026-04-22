INSERT INTO room_types (id, name, description, base_price, max_guests) VALUES
(1, 'Standard Room', 'A cozy room with essential amenities for a comfortable stay.', 100.00, 2),
(2, 'Deluxe Room', 'Spacious room with premium views and upgraded furnishings.', 150.00, 3),
(3, 'Executive Suite', 'Luxurious suite featuring a separate living area, panoramic views, and exclusive services.', 250.00, 4);

-- Standard Rooms
INSERT INTO rooms (id, room_number, room_type_id, status) VALUES (1, '101', 1, 'AVAILABLE');
INSERT INTO rooms (id, room_number, room_type_id, status) VALUES (2, '102', 1, 'AVAILABLE');
INSERT INTO rooms (id, room_number, room_type_id, status) VALUES (3, '103', 1, 'OCCUPIED');
INSERT INTO rooms (id, room_number, room_type_id, status) VALUES (4, '104', 1, 'CLEANING');

-- Deluxe Rooms
INSERT INTO rooms (id, room_number, room_type_id, status) VALUES (5, '105', 2, 'AVAILABLE');
INSERT INTO rooms (id, room_number, room_type_id, status) VALUES (6, '106', 2, 'AVAILABLE');
INSERT INTO rooms (id, room_number, room_type_id, status) VALUES (7, '107', 2, 'MAINTENANCE');

-- Suites
INSERT INTO rooms (id, room_number, room_type_id, status) VALUES (8, '108', 3, 'AVAILABLE');
INSERT INTO rooms (id, room_number, room_type_id, status) VALUES (9, '109', 3, 'OCCUPIED');
INSERT INTO rooms (id, room_number, room_type_id, status) VALUES (10, '110', 3, 'OUT_OF_ORDER');

-- Note: Because Quarkus Panache uses hibernate sequences for ID generation,
-- we need to increment the sequence to avoid collisions on new insertions.
ALTER SEQUENCE room_types_SEQ RESTART WITH 100;
ALTER SEQUENCE rooms_SEQ RESTART WITH 100;

