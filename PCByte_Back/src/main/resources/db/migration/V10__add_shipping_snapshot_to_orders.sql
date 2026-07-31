ALTER TABLE orders
    ADD COLUMN subtotal NUMERIC(19, 2);

UPDATE orders
SET subtotal = total
WHERE subtotal IS NULL;

ALTER TABLE orders
    ALTER COLUMN subtotal SET NOT NULL;

ALTER TABLE orders
    ADD COLUMN shipping_cost NUMERIC(19, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN shipping_rate_id BIGINT,
    ADD COLUMN shipping_type VARCHAR(50),
    ADD COLUMN shipping_label VARCHAR(150),
    ADD COLUMN shipping_carrier VARCHAR(100),
    ADD COLUMN shipping_free BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN estimated_min_days INTEGER,
    ADD COLUMN estimated_max_days INTEGER;