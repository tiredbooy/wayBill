CREATE TABLE IF NOT EXISTS waybill_status_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    waybill_id  INTEGER NOT NULL,
    status      VARCHAR(30) NOT NULL,
    location    VARCHAR(100),   
    notes       TEXT,   
    changed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by  VARCHAR(100) DEFAULT 'user', 

    FOREIGN KEY (waybill_id) REFERENCES waybill(id) ON DELETE CASCADE
);

CREATE INDEX idx_status_history_waybill ON waybill_status_history(waybill_id, changed_at);