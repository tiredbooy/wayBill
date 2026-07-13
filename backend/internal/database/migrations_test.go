package database

import (
	"database/sql"
	"testing"

	"github.com/golang-migrate/migrate/v4"
	migratesqlite "github.com/golang-migrate/migrate/v4/database/sqlite3"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	_ "github.com/mattn/go-sqlite3"
	migrationfiles "waybill/backend/migrations"
)

func TestRunMigrationsCreatesWaybillSchema(t *testing.T) {
	db := openMigrationTestDB(t, "complete")
	defer db.Close()

	if err := RunMigrations(db); err != nil {
		t.Fatalf("run migrations: %v", err)
	}

	var tableName string
	if err := db.QueryRow(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'waybill'`).Scan(&tableName); err != nil {
		t.Fatalf("waybill table was not created: %v", err)
	}
}

func TestRunMigrationsRepairsKnownDirtyVersionSix(t *testing.T) {
	db := openMigrationTestDB(t, "dirty-v6")
	defer db.Close()
	m := newTestMigrator(t, db)
	if err := m.Steps(5); err != nil {
		t.Fatalf("migrate to version 5: %v", err)
	}
	if _, err := db.Exec(`UPDATE schema_migrations SET version = 6, dirty = 1`); err != nil {
		t.Fatalf("mark version 6 dirty: %v", err)
	}

	if err := RunMigrations(db); err != nil {
		t.Fatalf("repair dirty migration: %v", err)
	}

	var tableName string
	if err := db.QueryRow(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'waybill'`).Scan(&tableName); err != nil {
		t.Fatalf("waybill table was not recovered: %v", err)
	}
}

func TestRialMigrationConvertsExistingAmounts(t *testing.T) {
	db := openMigrationTestDB(t, "rial")
	defer db.Close()
	m := newTestMigrator(t, db)
	if err := m.Steps(8); err != nil {
		t.Fatalf("migrate to version 8: %v", err)
	}
	if _, err := db.Exec(`PRAGMA foreign_keys = OFF`); err != nil {
		t.Fatal(err)
	}
	if _, err := db.Exec(`
		INSERT INTO waybill (
			id, waybill_number, issue_date, sender_id, receiver_id,
			freight_charge, insurance_amount, other_charges, total_amount
		) VALUES (1, 'test', '2026-01-01', 1, 2, 100, 20, 5, 125)
	`); err != nil {
		t.Fatalf("insert toman waybill: %v", err)
	}
	if _, err := db.Exec(`INSERT INTO payment (waybill_id, amount) VALUES (1, 125)`); err != nil {
		t.Fatalf("insert toman payment: %v", err)
	}
	if err := m.Steps(1); err != nil {
		t.Fatalf("apply rial migration: %v", err)
	}

	var freight, insurance, other, total, payment float64
	if err := db.QueryRow(`
		SELECT freight_charge, insurance_amount, other_charges, total_amount
		FROM waybill WHERE id = 1
	`).Scan(&freight, &insurance, &other, &total); err != nil {
		t.Fatal(err)
	}
	if err := db.QueryRow(`SELECT amount FROM payment WHERE waybill_id = 1`).Scan(&payment); err != nil {
		t.Fatal(err)
	}
	if freight != 1000 || insurance != 200 || other != 50 || total != 1250 || payment != 1250 {
		t.Fatalf("unexpected rial amounts: freight=%v insurance=%v other=%v total=%v payment=%v", freight, insurance, other, total, payment)
	}
}

func openMigrationTestDB(t *testing.T, name string) *sql.DB {
	t.Helper()
	db, err := sql.Open("sqlite3", "file:"+name+"?mode=memory&cache=shared")
	if err != nil {
		t.Fatal(err)
	}
	db.SetMaxOpenConns(1)
	if err := SetupPragmas(db); err != nil {
		db.Close()
		t.Fatal(err)
	}
	return db
}

func newTestMigrator(t *testing.T, db *sql.DB) *migrate.Migrate {
	t.Helper()
	driver, err := migratesqlite.WithInstance(db, &migratesqlite.Config{})
	if err != nil {
		t.Fatal(err)
	}
	source, err := iofs.New(migrationfiles.FS, ".")
	if err != nil {
		t.Fatal(err)
	}
	m, err := migrate.NewWithInstance("iofs", source, "sqlite3", driver)
	if err != nil {
		t.Fatal(err)
	}
	return m
}
