package main

import (
	"context"
	"embed"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"waybill/backend/cmd/server"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	logFile, logPath := setupLogging()
	if logFile != nil {
		defer logFile.Close()
	}
	log.Println("starting Waybill desktop application")

	serverErrors := make(chan error, 1)

	// Create an instance of the app structure
	app := NewApp(serverErrors, logPath)

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "Waybill",
		Width:     1180,
		Height:    820,
		MinWidth:  960,
		MinHeight: 680,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 255},
		SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId: "com.softdash.waybill.desktop",
			OnSecondInstanceLaunch: func(_ options.SecondInstanceData) {
				app.focusWindow()
			},
		},
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
			go runServer(serverErrors)
			// startTray(ctx)      // <-- add this line
		},
		OnDomReady: app.onDomReady,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		log.Printf("desktop runtime failed: %v", err)
		message := fmt.Sprintf("Waybill could not start.\n\n%v", err)
		if logPath != "" {
			message += "\n\nLog file: " + logPath
		}
		showFatalStartupError(message)
	}
}

func runServer(errors chan<- error) {
	defer close(errors)
	defer func() {
		if recovered := recover(); recovered != nil {
			errors <- fmt.Errorf("local service panicked: %v", recovered)
		}
	}()
	if err := server.Start(); err != nil {
		errors <- err
	}
}

func setupLogging() (*os.File, string) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		log.Printf("resolve config directory: %v", err)
		return nil, ""
	}

	logDir := filepath.Join(configDir, "waybill", "logs")
	if err := os.MkdirAll(logDir, 0755); err != nil {
		log.Printf("create log directory: %v", err)
		return nil, ""
	}

	logPath := filepath.Join(logDir, "waybill.log")
	file, err := os.OpenFile(logPath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		log.Printf("open log file: %v", err)
		return nil, ""
	}
	log.SetOutput(io.MultiWriter(file, os.Stderr))
	log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds | log.Lshortfile)
	return file, logPath
}
