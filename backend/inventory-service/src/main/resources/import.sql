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
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (4, '104', 1, 'CLEANING', 1);

-- Deluxe Rooms (floor 2)
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (5, '201', 2, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (6, '202', 2, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (7, '203', 2, 'MAINTENANCE', 2);

-- Suites (floor 3)
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (8, '301', 3, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (9, '302', 3, 'OCCUPIED', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (10, '303', 3, 'OUT_OF_ORDER', 3);

-- Reset sequences to avoid ID collision with auto-generated IDs
ALTER SEQUENCE room_types_seq RESTART WITH 100;
ALTER SEQUENCE rooms_seq RESTART WITH 100;
