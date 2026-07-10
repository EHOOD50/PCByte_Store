-- 1. Crear la tabla de categorías
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Insertar categorías iniciales para que el sistema no esté vacío
INSERT INTO categories (name) VALUES ('ALMACENAMIENTO'), ('PERIFERICOS'), ('HARDWARE'), ('MONITORES'), ('LAPTOPS');

-- 3. Modificar la tabla de productos para que use la relación
-- Primero borramos la columna vieja de texto
ALTER TABLE products DROP COLUMN category;

-- Luego añadimos la columna de llave foránea
ALTER TABLE products ADD COLUMN category_id BIGINT;

-- Finalmente añadimos la restricción de llave foránea (FK)
ALTER TABLE products
ADD CONSTRAINT fk_product_category
FOREIGN KEY (category_id) REFERENCES categories (id);