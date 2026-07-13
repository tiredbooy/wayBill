CREATE TABLE IF NOT EXISTS waybill (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    waybill_number      VARCHAR(50) UNIQUE NOT NULL,
    issue_date          DATE NOT NULL,
    dispatch_date       DATE,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    status              VARCHAR(30) DEFAULT 'created',
    sender_id           INTEGER NOT NULL, -- This 2 Are same in customer id
    receiver_id         INTEGER NOT NULL, -- This 2 Are same in customer id
    driver_id           INTEGER,
    vehicle_id          INTEGER,
    origin_location_id     INTEGER,
    destination_location_id INTEGER,
    total_weight        DECIMAL(10,2),
    total_packages      INTEGER,
    description         TEXT,
    freight_charge      DECIMAL(15,2) NOT NULL,
    have_insurance      BOOLEAN NOT NULL DEFAULT FALSE,
    insurance_amount    DECIMAL(15,2) DEFAULT 0,
    other_charges       DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,   
    payment_status      VARCHAR(20) DEFAULT 'unpaid',
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 

    FOREIGN KEY (sender_id)    REFERENCES customer(id),
    FOREIGN KEY (receiver_id)  REFERENCES customer(id),
    FOREIGN KEY (driver_id)    REFERENCES driver(id),
    FOREIGN KEY (vehicle_id)   REFERENCES vehicle(id),
    FOREIGN KEY (origin_location_id) REFERENCES location(id),
    FOREIGN KEY (destination_location_id) REFERENCES location(id)
);

-- Indexes (same as before, but now on customer)
CREATE INDEX idx_waybill_issue_date ON waybill(issue_date);
CREATE INDEX idx_waybill_status ON waybill(status);
CREATE INDEX idx_waybill_sender_id ON waybill(sender_id);   
CREATE INDEX idx_waybill_receiver_id ON waybill(receiver_id);
CREATE INDEX idx_waybill_driver_id ON waybill(driver_id);
CREATE INDEX idx_waybill_vehicle_id ON waybill(vehicle_id);
CREATE INDEX idx_waybill_status_issue_date ON waybill(status, issue_date);
