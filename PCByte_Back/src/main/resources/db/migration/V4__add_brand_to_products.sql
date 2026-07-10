ALTER TABLE products
ADD COLUMN brand_id BIGINT;

ALTER TABLE products
ADD CONSTRAINT fk_product_brand
FOREIGN KEY (brand_id)
REFERENCES brands(id);