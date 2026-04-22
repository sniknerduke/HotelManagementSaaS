INSERT INTO reservations (id, user_id, room_id, check_in_date, check_out_date, total_price, adult_count, child_count, guest_notes, status, created_at)
VALUES (1, '11111111-1111-1111-1111-111111111111', 3, CURRENT_DATE - 2, CURRENT_DATE + 3, 500.00, 2, 0, 'Late check-in requested.', 'CONFIRMED', CURRENT_TIMESTAMP);

INSERT INTO reservations (id, user_id, room_id, check_in_date, check_out_date, total_price, adult_count, child_count, guest_notes, status, created_at)
VALUES (2, '22222222-2222-2222-2222-222222222222', 9, CURRENT_DATE, CURRENT_DATE + 5, 1250.00, 2, 1, 'Needs extra pillows.', 'PENDING', CURRENT_TIMESTAMP);

INSERT INTO reservations (id, user_id, room_id, check_in_date, check_out_date, total_price, adult_count, child_count, guest_notes, status, created_at)
VALUES (3, '22222222-2222-2222-2222-222222222222', 1, CURRENT_DATE - 10, CURRENT_DATE - 8, 200.00, 1, 0, NULL, 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '10' DAY);

ALTER SEQUENCE reservations_SEQ RESTART WITH 100;
