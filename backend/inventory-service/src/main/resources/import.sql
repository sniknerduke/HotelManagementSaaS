-- Seed data for inventory-service

-- Amenities
INSERT INTO amenities (id, name, description, icon) VALUES
(1, 'High-Speed Wi-Fi', 'Fast and complimentary Wi-Fi access throughout the property.', 'wifi'),
(2, 'Swimming Pool', 'Indoor/Outdoor heated swimming pool.', 'pool'),
(3, 'Fitness Center / Gym', 'State-of-the-art gym and fitness equipment.', 'fitness_center'),
(4, 'Spa & Wellness Center', 'Relaxing spa treatments and massage therapies.', 'spa'),
(5, 'On-site Restaurant & Bar', 'World-class dining serving local and international cuisine.', 'restaurant'),
(6, 'Air Conditioning / Climate Control', 'Indicqcqcqvidual climate control in every room.', 'ac_unit'),
(7, 'Flat-screen TV', 'Smart TV with premium channels.', 'tv'),
(8, 'Curated Minibar', 'Fully stocked minibar with premium drinks and snacks.', 'kitchen'),
(9, 'En-suite Bathroom', 'Luxurious bathtub and shower with complimentary toiletries.', 'bathtub'),
(10, 'Coffee / Tea Maker', 'In-room coffee machine and tea selection.', 'coffee'),
(11, '24/7 Front Desk & Concierge', 'Round-the-clock front desk and guest services.', 'room_service'),
(12, 'Room Service', '24-hour in-room dining service.', 'room_service'),
(13, 'Airport Shuttle', 'Convenient transfers to and from the airport.', 'airport_shuttle'),
(14, 'Daily Housekeeping', 'Daily room cleaning and turndown service.', 'cleaning_services');

-- Room types with image_url included
INSERT INTO room_types (id, name, description, base_price, max_guests, image_url) VALUES
(1, 'Standard Room', 'A cozy room with essential amenities for a comfortable stay.', 100.00, 2, '/images/rooms/standard.jpg'),
(2, 'Deluxe Room', 'Spacious room with premium views and upgraded furnishings.', 150.00, 3, '/images/rooms/deluxe.jpg'),
(3, 'Executive Suite', 'Luxurious suite featuring a separate living area, panoramic views, and exclusive services.', 250.00, 4, '/images/rooms/suite.jpg');

-- Room Type Amenities
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES
(1, 1), (1, 6), (1, 7), (1, 10), (1, 14),
(2, 1), (2, 2), (2, 3), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 12), (2, 14),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (3, 10), (3, 11), (3, 12), (3, 13), (3, 14);

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

-- Hotel Settings
INSERT INTO hotel_settings (id, hotel_name, tax_rate, currency, breakfast_price, min_nights, max_nights, max_guests_per_booking, check_in_time, check_out_time) VALUES
(1, 'Lumière Hotel & Resort', 8.50, 'USD', 25.00, 1, 30, 8, '14:00', '11:00');

-- Generated Rooms
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (101, '101', 3, 'AVAILABLE', 0);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (102, '102', 1, 'AVAILABLE', 0);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (103, '103', 2, 'AVAILABLE', 0);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (104, '104', 3, 'AVAILABLE', 0);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (105, '105', 1, 'AVAILABLE', 0);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (106, '106', 2, 'AVAILABLE', 0);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (107, '107', 3, 'AVAILABLE', 0);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (108, '108', 1, 'AVAILABLE', 0);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (109, '109', 2, 'AVAILABLE', 0);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (110, '110', 3, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (111, '111', 1, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (112, '112', 2, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (113, '113', 3, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (114, '114', 1, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (115, '115', 2, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (116, '116', 3, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (117, '117', 1, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (118, '118', 2, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (119, '119', 3, 'AVAILABLE', 1);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (120, '120', 1, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (121, '121', 2, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (122, '122', 3, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (123, '123', 1, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (124, '124', 2, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (125, '125', 3, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (126, '126', 1, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (127, '127', 2, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (128, '128', 3, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (129, '129', 1, 'AVAILABLE', 2);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (130, '130', 2, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (131, '131', 3, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (132, '132', 1, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (133, '133', 2, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (134, '134', 3, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (135, '135', 1, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (136, '136', 2, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (137, '137', 3, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (138, '138', 1, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (139, '139', 2, 'AVAILABLE', 3);
INSERT INTO rooms (id, room_number, room_type_id, status, floor) VALUES (140, '140', 3, 'AVAILABLE', 4);

-- Reset sequences to avoid ID collision with auto-generated IDs
ALTER SEQUENCE room_types_seq RESTART WITH 200;
ALTER SEQUENCE rooms_seq RESTART WITH 200;
ALTER SEQUENCE hotel_settings_seq RESTART WITH 200;
ALTER SEQUENCE housekeeping_tasks_seq RESTART WITH 200;
ALTER SEQUENCE amenities_seq RESTART WITH 200;