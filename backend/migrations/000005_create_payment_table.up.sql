CREATE TABLE IF NOT EXISTS payment (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    waybill_id      INTEGER NOT NULL,
    amount          NUMERIC NOT NULL,
    paid_at         TEXT,              
    method          TEXT,           
    reference       TEXT,         
    notes           TEXT,
    created_at      TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (waybill_id) REFERENCES waybill(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payment_waybill_id ON payment(waybill_id);
CREATE INDEX IF NOT EXISTS idx_payment_paid_at    ON payment(paid_at);