package database

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

var (
	DB     *sql.DB
	DBPath string
)

func Init() (*sql.DB, error) {
	appDir, err := os.UserConfigDir()
	if err != nil {
		return nil, err
	}

	DBPath = filepath.Join(appDir, "waybill", "waybill.db")
	log.Println("DB PATH: ", DBPath)

	if err := os.MkdirAll(filepath.Dir(DBPath), 0755); err != nil {
		return nil, err
	}

	db, err := sql.Open("sqlite3", DBPath)

	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		log.Printf("[BOOT] db ping failed right after init: %v", err)
	} else {
		log.Printf("[BOOT] db ping ok")
	}

	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)
	db.SetConnMaxLifetime(0)

	DB = db
	log.Printf("SQLite initialized at %s", DBPath)

	return DB, nil
}

func GetDB() *sql.DB { return DB }

func Close() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
}

func SetupPragmas(db *sql.DB) error {
	_, err := db.Exec(`
		PRAGMA journal_mode = WAL;
		PRAGMA synchronous = NORMAL;
		PRAGMA busy_timeout = 5000;
		PRAGMA foreign_keys = ON;
	`)
	return err
}
