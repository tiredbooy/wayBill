package database

import (
	"database/sql"
	"errors"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	"github.com/golang-migrate/migrate/v4/source/iofs"

	mig "waybill/backend/migrations"
)

type DirtyDBError struct {
	Version uint
	Cause   error
}

func (e *DirtyDBError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("database is dirty at version %d: %v", e.Version, e.Cause)
	}
	return fmt.Sprintf("database is dirty at version %d", e.Version)
}

func (e *DirtyDBError) Unwrap() error { return e.Cause }


func RunMigrations(db *sql.DB) error {
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		return fmt.Errorf("create driver: %w", err)
	}

	src, err := iofs.New(mig.FS, ".")
	if err != nil {
		return fmt.Errorf("init embedded migrations: %w", err)
	}

	m, err := migrate.NewWithInstance("iofs", src, "sqlite3", driver)
	if err != nil {
		return fmt.Errorf("create migrate instance: %w", err)
	}

	if v, dirty, err := m.Version(); err == nil && dirty {
		return &DirtyDBError{Version: v}
	}

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		if v, dirty, verr := m.Version(); verr == nil && dirty {
			return &DirtyDBError{Version: v, Cause: err}
		}
		return fmt.Errorf("migrate up: %w", err)
	}

	v, dirty, _ := m.Version()
	log.Printf("migrations: version=%d dirty=%v", v, dirty)
	return nil
}
