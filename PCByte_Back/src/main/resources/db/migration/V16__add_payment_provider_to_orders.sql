ALTER TABLE orders
ADD COLUMN payment_provider VARCHAR(30);

UPDATE orders
SET payment_provider = 'MERCADO_PAGO'
WHERE payment_id IS NOT NULL
  AND TRIM(payment_id) <> '';

ALTER TABLE orders
ADD CONSTRAINT chk_orders_payment_provider
CHECK (
    payment_provider IS NULL
    OR payment_provider IN (
        'MERCADO_PAGO',
        'WEBPAY'
    )
);