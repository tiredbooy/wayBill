CREATE TABLE IF NOT EXISTS location (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(100) NOT NULL, 
    province    VARCHAR(50),
    is_terminal BOOLEAN DEFAULT FALSE, 
    address TEXT,
    UNIQUE(name)
);