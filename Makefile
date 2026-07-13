# Waybill Wails Build System
#
# Prerequisites:
#   - Go 1.24+
#   - Node.js 20+
#   - Wails CLI (go install github.com/wailsapp/wails/v2/cmd/wails@latest)
#   - UPX (optional, Linux compression only)
#
# Quick start:
#   make deps          # check required tools
#   make build         # build for current platform
#   make build-linux   # cross-compile for Linux
#   make build-windows # cross-compile for Windows
#   make dist          # build + compress + package for all platforms

APP_NAME   := waybill
BIN_DIR    := build/bin
DIST_DIR   := dist
VERSION    ?= $(shell tag=$$(git describe --tags --abbrev=0 2>/dev/null); if [ -n "$$tag" ]; then printf '%s' "$${tag#v}"; else printf '%s' "1.0.0"; fi)
COMMIT     := $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_DATE := $(shell date -u +%Y-%m-%dT%H:%M:%SZ)
LD_FLAGS := -s -w
DEBUG_LD_FLAGS :=
WAILS ?= $(shell command -v wails 2>/dev/null || printf '%s/bin/wails' "$$(go env GOPATH)")
WINDOWS_CC ?= x86_64-w64-mingw32-gcc
WINDOWS_386_CC ?= i686-w64-mingw32-gcc

WAILS_FLAGS := -ldflags "$(LD_FLAGS)" -webview2 embed
DEBUG_WAILS_FLAGS := -ldflags "$(DEBUG_LD_FLAGS)" -webview2 embed

UNAME_S := $(shell uname -s)

# Detect available compressors
USE_UPX := $(shell command -v upx 2>/dev/null && echo 1 || echo 0)

INNO_IMAGE      := waybill-innosetup
INNO_DOCKERFILE := docker/Dockerfile.innosetup

# ──────────────────────────────────────────────
# Help
# ──────────────────────────────────────────────

.PHONY: help
help: ## Show this help message
	@echo "Waybill Wails Build System"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  %-22s %s\n", $$1, $$2}'
	@echo ""
	@echo "Variables (override with make target VAR=value):"
	@echo "  VERSION     = $(VERSION)"
	@echo "  DIST_DIR    = $(DIST_DIR)"
	@echo ""

# ──────────────────────────────────────────────
# Dependencies
# ──────────────────────────────────────────────

.PHONY: deps
deps: ## Verify all required build tools are installed
	@echo "--- Checking dependencies ---"
	@for cmd in go node npm; do \
		if command -v $$cmd >/dev/null 2>&1; then \
			echo "  [OK] $$cmd"; \
		else \
			echo "  [MISSING] $$cmd"; \
			exit 1; \
		fi; \
	done
	@if [ -x "$(WAILS)" ]; then echo "  [OK] wails ($(WAILS))"; else echo "  [MISSING] wails ($(WAILS))"; exit 1; fi
	@if [ "$(UNAME_S)" = "Linux" ]; then \
		if command -v pkg-config >/dev/null 2>&1 && pkg-config --exists webkit2gtk-4.0; then \
			echo "  [OK] webkit2gtk-4.0"; \
		else \
			echo "  [MISSING] webkit2gtk-4.0 development package (required for Linux builds)"; \
			exit 1; \
		fi; \
	fi
	@if [ "$(USE_UPX)" = "1" ]; then \
		echo "  [OK] upx"; \
	else \
		echo "  [OPTIONAL] upx not found — install for binary compression"; \
	fi

.PHONY: install-wails
install-wails: ## Install Wails CLI
	go install github.com/wailsapp/wails/v2/cmd/wails@v2.12.0

.PHONY: frontend-deps
frontend-deps: ## Install frontend npm dependencies
	@echo "--- Installing frontend dependencies ---"
	npm --prefix frontend ci

# ──────────────────────────────────────────────
# Frontend
# ──────────────────────────────────────────────

.PHONY: frontend-build
frontend-build: ## Build the React frontend (tsc + vite)
	@echo "--- Building frontend ---"
	npm --prefix frontend run build

.PHONY: frontend-dev
frontend-dev: ## Start Vite dev server
	npm --prefix frontend run dev

# ──────────────────────────────────────────────
# Build
# ──────────────────────────────────────────────

.PHONY: build
build: ## Build for the current platform (Wails builds the frontend)
	@echo "--- Building $(APP_NAME) for $(UNAME_S) ---"
	$(WAILS) build $(WAILS_FLAGS) -o "$(APP_NAME)"
	@echo ""
	@echo "  Binary: $(BIN_DIR)/$(APP_NAME)$(shell [ "$(UNAME_S)" = "Linux" ] || echo '.exe')"

.PHONY: build-linux
build-linux: ## Build for Linux (amd64)
	@echo "--- Building $(APP_NAME) for linux/amd64 ---"
	$(WAILS) build $(WAILS_FLAGS) -platform linux/amd64 -o "$(APP_NAME)-linux-amd64"
	@echo ""
	@echo "  Binary: $(BIN_DIR)/$(APP_NAME)-linux-amd64"

.PHONY: build-windows
build-windows: ## Cross-compile for Windows (amd64)
	@echo "--- Building $(APP_NAME) for windows/amd64 ---"
	@command -v "$(WINDOWS_CC)" >/dev/null 2>&1 || { echo "  [MISSING] $(WINDOWS_CC)"; exit 1; }
	CC=$(WINDOWS_CC) \
	CGO_ENABLED=1 \
	$(WAILS) build \
		$(WAILS_FLAGS) \
		-platform windows/amd64 \
		-o "waybill.exe"
	@echo ""
	@echo "  Binary: $(BIN_DIR)/waybill.exe"

.PHONY: build-windows-debug
build-windows-debug: ## Build Windows debug executable
	@echo "--- Building $(APP_NAME) for windows/amd64 (DEBUG) ---"
	@command -v "$(WINDOWS_CC)" >/dev/null 2>&1 || { echo "  [MISSING] $(WINDOWS_CC)"; exit 1; }
	CC=$(WINDOWS_CC) \
	CGO_ENABLED=1 \
	$(WAILS) build \
		$(DEBUG_WAILS_FLAGS) \
		-platform windows/amd64 \
		-debug \
		-o "waybill-debug.exe"
	@echo ""
	@echo "  Binary: $(BIN_DIR)/waybill-debug.exe"

.PHONY: build-windows-386
build-windows-386: ## Cross-compile for Windows (386)
	@echo "--- Building $(APP_NAME) for windows/386 ---"
	@command -v "$(WINDOWS_386_CC)" >/dev/null 2>&1 || { echo "  [MISSING] $(WINDOWS_386_CC)"; exit 1; }
	CC=$(WINDOWS_386_CC) CGO_ENABLED=1 $(WAILS) build $(WAILS_FLAGS) -platform windows/386 -o "$(APP_NAME)-windows-386.exe"
	@echo ""
	@echo "  Binary: $(BIN_DIR)/$(APP_NAME)-windows-386"

.PHONY: build-all
build-all: build-linux build-windows ## Build for all supported platforms

.PHONY: build-dev
build-dev: ## Build with dev mode (no compression, debug symbols, Vite dev server URL)
	@echo "--- Building $(APP_NAME) in dev mode ---"
	$(WAILS) build -tags "dev" -o "$(APP_NAME)-dev"
	@echo "  Binary: $(BIN_DIR)/$(APP_NAME)-dev"

# ──────────────────────────────────────────────
# Compression
# ──────────────────────────────────────────────

.PHONY: compress compress-linux
compress: compress-linux ## Compress Linux binaries only (avoids Windows AV false positives)

compress-linux: ## Compress Linux binaries with UPX if available
	@echo "--- Compressing Linux binaries in $(BIN_DIR) ---"
	@for f in $(BIN_DIR)/$(APP_NAME)-linux-*; do \
		if [ -f "$$f" ] && [ ! -L "$$f" ]; then \
			if [ "$(USE_UPX)" = "1" ]; then \
				upx --best --lzma "$$f" 2>/dev/null && echo "  [UPX] $$(basename $$f) compressed" || \
				{ echo "  [UPX] $$(basename $$f) failed (not an ELF/PE?)"; }; \
			else \
				strip "$$f" 2>/dev/null && echo "  [STRIP] $$(basename $$f) stripped" || \
				echo "  [SKIP] $$(basename $$f)"; \
			fi; \
		fi; \
	done

.PHONY: compress-upx
compress-upx: ## Compress all binaries with UPX (fail if not installed)
	@echo "--- Compressing with UPX ---"
	@for f in $(BIN_DIR)/$(APP_NAME)* $(BIN_DIR)/$(APP_NAME)*.exe; do \
		if [ -f "$$f" ] && [ ! -L "$$f" ]; then \
			upx --best --lzma "$$f" && echo "  [UPX] $$(basename $$f)"; \
		fi; \
	done

.PHONY: compress-strip
compress-strip: ## Strip debug symbols from binaries
	@echo "--- Stripping binaries ---"
	@for f in $(BIN_DIR)/$(APP_NAME)* $(BIN_DIR)/$(APP_NAME)*.exe; do \
		if [ -f "$$f" ] && [ ! -L "$$f" ]; then \
			strip "$$f" 2>/dev/null && echo "  [STRIP] $$(basename $$f)" || true; \
		fi; \
	done

.PHONY: size
size: ## Show binary sizes
	@echo "--- Binary sizes ---"
	@if ls $(BIN_DIR)/$(APP_NAME)* 2>/dev/null | grep -q .; then \
		ls -lh $(BIN_DIR)/$(APP_NAME)* 2>/dev/null; \
	else \
		echo "  No binaries found. Run 'make build' first."; \
	fi

# ──────────────────────────────────────────────
# Distribution packages
# ──────────────────────────────────────────────

.PHONY: dist-linux
dist-linux: build-linux compress-linux ## Build, compress, and package Linux binary
	@echo "--- Packaging Linux release ---"
	mkdir -p $(DIST_DIR)
	tar -czf "$(DIST_DIR)/$(APP_NAME)-$(VERSION)-linux-amd64.tar.gz" \
		-C $(BIN_DIR) "$(APP_NAME)-linux-amd64"
	@echo "  Package: $(DIST_DIR)/$(APP_NAME)-$(VERSION)-linux-amd64.tar.gz"

.PHONY: dist-windows
dist-windows: build-windows ## Build and package the Windows binary without UPX
	@echo "--- Packaging Windows release ---"
	mkdir -p $(DIST_DIR)
	zip -j -q "$(DIST_DIR)/$(APP_NAME)-$(VERSION)-windows-amd64.zip" \
		"$(BIN_DIR)/$(APP_NAME).exe"
	@echo "  Package: $(DIST_DIR)/$(APP_NAME)-$(VERSION)-windows-amd64.zip"

.PHONY: dist-windows-msi
dist-windows-msi: build-windows ## Build Windows binary + generate MSI installer
	@echo "--- Building MSI installer ---"
	@mkdir -p "$(DIST_DIR)"
	@if command -v wixl >/dev/null 2>&1; then \
		wixl --arch x64 -D ProductVersion="$(VERSION)" -o "$(DIST_DIR)/$(APP_NAME)-$(VERSION)-windows-amd64.msi" installer.wxs && \
		echo "  MSI: $(DIST_DIR)/$(APP_NAME)-$(VERSION)-windows-amd64.msi"; \
	else \
		echo "  [MISSING] wixl (install package 'msitools')"; \
		exit 1; \
	fi

.PHONY: dist
dist: dist-linux dist-windows ## Build, compress, and package for all platforms

.PHONY: dist-all
dist-all: dist dist-windows-msi dist-windows-installer ## Full release: all platforms + MSI + Inno Setup installer
# ──────────────────────────────────────────────
# Utilities
# ──────────────────────────────────────────────

.PHONY: clean
clean: ## Remove all build artifacts
	@echo "--- Cleaning ---"
	rm -rf $(BIN_DIR)/*
	rm -rf $(DIST_DIR)
	rm -rf frontend/dist
	@echo "  [OK] Cleaned"

.PHONY: clean-deps
clean-deps: ## Remove node_modules and frontend lockfile
	rm -rf frontend/node_modules
	rm -f frontend/package-lock.json
	@echo "  [OK] Frontend deps cleaned"

.PHONY: info
info: ## Show project info and tool versions
	@echo "--- Project Info ---"
	@echo "  App:        $(APP_NAME)"
	@echo "  Version:    $(VERSION)"
	@echo "  Commit:     $(COMMIT)"
	@echo "  Build Date: $(BUILD_DATE)"
	@echo "  Platform:   $(UNAME_S)"
	@echo ""
	@echo "--- Tool Versions ---"
	@echo "  Go:   $$(go version | grep -oP 'go\d+\.\d+' || go version 2>&1 | head -1)"
	@echo "  Node: $$(node -v 2>/dev/null)"
	@echo "  Npm:  $$(npm -v 2>/dev/null)"
	@echo "  Wails: $$($(WAILS) version 2>/dev/null | head -1 || echo 'not found')"
	@if command -v upx >/dev/null 2>&1; then \
		echo "  UPX:  $$(upx --version 2>/dev/null | head -1)"; \
	fi
	@echo ""
	@echo "--- Build Targets ---"
	@ls -lh $(BIN_DIR)/* 2>/dev/null || echo "  (no binaries yet — run make build)"

# ──────────────────────────────────────────────
# Convenience aliases
# ──────────────────────────────────────────────


.PHONY: installer-image
installer-image: ## Build the Inno Setup Docker image
	@docker image inspect $(INNO_IMAGE) >/dev/null 2>&1 || docker build -t $(INNO_IMAGE) -f $(INNO_DOCKERFILE) .

.PHONY: dist-windows-installer
dist-windows-installer: build-windows installer-image
	@echo "--- Running Inno Setup compiler in Docker ---"
	mkdir -p release
	docker run --rm -v "$(CURDIR):/work" $(INNO_IMAGE) \
		/DMyAppVersion="$(VERSION)" installer/waybill.iss
	@echo "  Installer: release/WaybillSetup-$(VERSION).exe"

.PHONY: check
check: ## Run backend tests, Go vet, and the production frontend build
	go test .
	cd backend && go test ./... && go vet ./...
	npm --prefix frontend run build

.PHONY: all
all: dist ## Alias for dist (build + compress + package all platforms)

.PHONY: release
release: dist-all ## Alias for dist-all (full release pipeline)
