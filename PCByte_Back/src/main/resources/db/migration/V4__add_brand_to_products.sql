-- Agregar brand_id si todavía no existe
ALTER TABLE products
ADD COLUMN IF NOT EXISTS brand_id BIGINT;

-- Agregar la llave foránea solamente si no existe con este nombre
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_product_brand'
    ) THEN
        ALTER TABLE products
        ADD CONSTRAINT fk_product_brand
        FOREIGN KEY (brand_id)
        REFERENCES brands(id);
    END IF;
END
$$;