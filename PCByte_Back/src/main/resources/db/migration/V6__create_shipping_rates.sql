CREATE TABLE shipping_rates (

    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    region VARCHAR(120),

    city VARCHAR(120),

    shipping_type VARCHAR(50) NOT NULL,

    carrier VARCHAR(80),

    price NUMERIC(12,2) NOT NULL,

    free_shipping_from NUMERIC(12,2),

    estimated_min_days INTEGER NOT NULL,

    estimated_max_days INTEGER NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    priority INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_shipping_price_non_negative
        CHECK (price >= 0),

    CONSTRAINT chk_shipping_free_from_non_negative
        CHECK (
            free_shipping_from IS NULL
            OR free_shipping_from >= 0
        ),

    CONSTRAINT chk_shipping_min_days_non_negative
        CHECK (estimated_min_days >= 0),

    CONSTRAINT chk_shipping_max_days_valid
        CHECK (
            estimated_max_days >= estimated_min_days
        )
);

CREATE INDEX idx_shipping_rates_region
    ON shipping_rates(region);

CREATE INDEX idx_shipping_rates_city
    ON shipping_rates(city);

CREATE INDEX idx_shipping_rates_active
    ON shipping_rates(active);

CREATE INDEX idx_shipping_rates_priority
    ON shipping_rates(priority);

CREATE INDEX idx_shipping_rates_lookup
    ON shipping_rates(
        active,
        region,
        city,
        shipping_type,
        priority
    );