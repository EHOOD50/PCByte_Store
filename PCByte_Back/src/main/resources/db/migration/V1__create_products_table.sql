CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price NUMERIC(19,2) NOT NULL,
    stock INTEGER NOT NULL,
    category VARCHAR(255) NOT NULL
);
