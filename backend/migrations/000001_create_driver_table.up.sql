CREATE TABLE IF NOT EXISTS driver (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    vehicle_id INTEGER,                         
    phone VARCHAR(20),
    address TEXT,
    national_code VARCHAR(50) UNIQUE,
    email VARCHAR(100),
    license_number VARCHAR(50),
    license_expiry DATE,
    hire_date DATE,
    birth_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TRIGGER update_driver_timestamp AFTER UPDATE ON driver
BEGIN
    UPDATE driver SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;