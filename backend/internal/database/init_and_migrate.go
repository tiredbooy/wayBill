package database

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
)

func InitAndMigrate() (*sql.DB, error) {
	db, err := Init()
	if err != nil {
		return nil, fmt.Errorf("database init failed: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("database ping failed: %w", err)
	}

	if err := SetupPragmas(db); err != nil {
		return nil, fmt.Errorf("pragma setup failed: %w", err)
	}

	err = RunMigrations(db)
	if err == nil {
		return db, nil
	}

	var dirtyErr *DirtyDBError
	if errors.As(err, &dirtyErr) && os.Getenv("WAYBILL_DEV_RESET_DB") == "1" {
		if DBPath == "" {
			return nil, fmt.Errorf("db is dirty but DBPath is empty")
		}

		if err := os.Remove(DBPath); err != nil {
			return nil, fmt.Errorf("failed to remove dirty database: %w", err)
		}

		db2, err := Init()
		if err != nil {
			return nil, fmt.Errorf("re-init after reset failed: %w", err)
		}
		if err := SetupPragmas(db2); err != nil {
			return nil, fmt.Errorf("pragma setup after reset failed: %w", err)
		}
		if err := RunMigrations(db2); err != nil {
			return nil, fmt.Errorf("migration after reset failed: %w", err)
		}
		return db2, nil
	}

	return nil, fmt.Errorf("migration failed: %w", err)
}