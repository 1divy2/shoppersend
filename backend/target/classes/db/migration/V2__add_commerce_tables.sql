ALTER TABLE categories 
ADD COLUMN description TEXT, 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true, 
ADD COLUMN updated_at TIMESTAMP;

ALTER TABLE products 
ADD COLUMN long_description TEXT, 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE product_variants 
ADD COLUMN attributes JSONB, 
ADD COLUMN image_url VARCHAR(1000), 
ADD COLUMN updated_at TIMESTAMP;

ALTER TABLE inventory 
RENAME COLUMN variant_id TO product_variant_id;
ALTER TABLE inventory 
RENAME COLUMN available_stock TO quantity_available;
ALTER TABLE inventory 
RENAME COLUMN reserved_stock TO quantity_reserved;
ALTER TABLE inventory 
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE sellers (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    store_name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE carts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES carts(id),
    product_variant_id UUID NOT NULL REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    order_number VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    shipping_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id),
    product_variant_id UUID NOT NULL REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
