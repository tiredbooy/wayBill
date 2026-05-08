# Makefile for database migrations with golang-migrate
# Usage examples:
#   make new name=create_driver_table
#   make up
#   make down
#   make status

# Always resolve paths from the Makefile's location (repo root)
ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
MIGRATIONS_DIR ?= $(ROOT_DIR)backend/migrations

# Default DB path similar to os.UserConfigDir() behavior per OS
ifeq ($(OS),Windows_NT)
  DB_PATH ?= $(APPDATA)/waybill/waybill.db
else
  UNAME_S := $(shell uname -s)
  ifeq ($(UNAME_S),Darwin)
    DB_PATH ?= $(HOME)/Library/Application\ Support/waybill/waybill.db
  else
    DB_PATH ?= $(HOME)/.config/waybill/waybill.db
  endif
endif

DB_URL ?= sqlite3://$(DB_PATH)

# If you later switch to PostgreSQL/MySQL/etc, just override DB_URL
# e.g. DB_URL = postgres://user:pass@localhost:5432/waybills?sslmode=disable

.PHONY: help new up down redo status version force drop

help: ## Show this help message
	@echo "Migration helpers (using golang-migrate)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

new: ## Create a new migration →   make new name=add_status_to_driver
	@if [ -z "$(name)" ]; then echo "Error: provide name=..."; exit 1; fi
	migrate create -ext sql -dir $(MIGRATIONS_DIR) -seq $(name)

up: ## Apply all pending migrations
	migrate -path $(MIGRATIONS_DIR) -database "$(DB_URL)" up

down: ## Rollback the last migration
	migrate -path $(MIGRATIONS_DIR) -database "$(DB_URL)" down

redo: ## Rollback last migration and re-apply it (useful during dev)
	migrate -path $(MIGRATIONS_DIR) -database "$(DB_URL)" down && migrate -path $(MIGRATIONS_DIR) -database "$(DB_URL)" up

status: ## Show migration status
	migrate -path $(MIGRATIONS_DIR) -database "$(DB_URL)" status -verbose

version: ## Show current migration version
	migrate -path $(MIGRATIONS_DIR) -database "$(DB_URL)" version

force: ## Force set current version (use with care!) → make force v=3
	migrate -path backend/migrations -database "sqlite3:$DB" force 1

drop: ## Drop everything (dangerous – use only in dev!)
	migrate -path $(MIGRATIONS_DIR) -database "$(DB_URL)" drop -f

create-db: ## Create empty SQLite file if it doesn't exist
	@touch $(DB_NAME)
	@echo "Database file $(DB_NAME) ready."