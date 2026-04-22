INSERT INTO payments (id, reservation_id, amount, payment_method, transaction_id, status, payment_date)
VALUES (1, 1, 500.00, 'CREDIT_CARD', 'TXN-1234567890', 'COMPLETED', CURRENT_TIMESTAMP);

INSERT INTO payments (id, reservation_id, amount, payment_method, transaction_id, status, payment_date)
VALUES (2, 2, 1250.00, 'PAYPAL', 'TXN-0987654321', 'PENDING', CURRENT_TIMESTAMP);

INSERT INTO payments (id, reservation_id, amount, payment_method, transaction_id, status, payment_date)
VALUES (3, 3, 200.00, 'CREDIT_CARD', 'TXN-5555555555', 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '10' DAY);

ALTER SEQUENCE payments_SEQ RESTART WITH 100;
