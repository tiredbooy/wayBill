package server

import (
	"fmt"
	"log"
	"waybill/backend/internal/bootstrap"
	"waybill/backend/internal/config"
)

func Start() error {
	cfg := config.Load()

	app, err := bootstrap.New(cfg)
	if err != nil {
		return fmt.Errorf("initialize application: %w", err)
	}

	log.Printf("starting HTTP server on %s", cfg.ServerPort)
	if err := app.Run(); err != nil {
		return fmt.Errorf("run server: %w", err)
	}
	return nil
}

func main() {
	if err := Start(); err != nil {
		log.Fatal(err)
	}
}
