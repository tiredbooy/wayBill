package server

import (
	"log"
	"waybill/backend/internal/bootstrap"
	"waybill/backend/internal/config"
)

func Start() {
    cfg := config.Load()

    app, err := bootstrap.New(cfg)
    if err != nil {
        log.Fatalf("failed to initialize application: %v", err)
    }

    log.Printf("starting HTTP server on :%s", cfg.ServerPort)
    if err := app.Run(); err != nil {
        log.Fatalf("server failed: %v", err)
    }
}