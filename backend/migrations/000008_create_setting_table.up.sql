CREATE TABLE IF NOT EXISTS setting (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    company_name TEXT NOT NULL,
    address TEXT,
    contact TEXT NOT NULL,
    commission_rate REAL DEFAULT 0,
    preferred_theme TEXT DEFAULT 'light',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_setting_updated_at 
AFTER UPDATE ON setting
BEGIN
    UPDATE setting SET updated_at = CURRENT_TIMESTAMP WHERE id = 1;
END;