-- Crear tabla de categorías solamente si no existe
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Insertar categorías iniciales evitando duplicados
INSERT INTO categories (name)
VALUES
    ('ALMACENAMIENTO'),
    ('PERIFERICOS'),
    ('HARDWARE'),
    ('MONITORES'),
    ('LAPTOPS')
ON CONFLICT (name) DO NOTHING;

-- Eliminar la antigua categoría almacenada como texto, si todavía existe
ALTER TABLE products
DROP COLUMN IF EXISTS category;

-- Agregar category_id si todavía no existe
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category_id BIGINT;

-- Agregar la llave foránea solamente si no existe con este nombre
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_product_category'
    ) THEN
        ALTER TABLE products
        ADD CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id);
    END IF;
END
$$;