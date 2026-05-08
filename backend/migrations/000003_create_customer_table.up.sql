CREATE TABLE IF NOT EXISTS customer (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    name                VARCHAR(150)        NOT NULL,
    national_id         VARCHAR(20),  
    economic_code       VARCHAR(20),
    phone_mobile        VARCHAR(11),
    phone_fixed         VARCHAR(20), 
    address             TEXT                NOT NULL,
    postal_code         VARCHAR(10),
    city                VARCHAR(100),
    province            VARCHAR(100),
    email               VARCHAR(120),
    notes               TEXT,
    created_at          TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_customer_timestamp 
AFTER UPDATE ON customer
BEGIN
    UPDATE customer SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;