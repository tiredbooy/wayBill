CREATE TABLE IF NOT EXISTS vehicle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plate VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(100),
    make VARCHAR(80),
    year INTEGER,
    capacity DECIMAL(10,2),
    color VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active', 
    insurance_expiry DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_vehicle_timestamp 
AFTER UPDATE ON vehicle
BEGIN
    UPDATE vehicle SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;