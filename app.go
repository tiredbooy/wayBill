package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx           context.Context
	ctxMu         sync.RWMutex
	startupErrors <-chan error
	logPath       string
}

// NewApp creates a new App application struct
func NewApp(startupErrors <-chan error, logPath string) *App {
	return &App{startupErrors: startupErrors, logPath: logPath}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctxMu.Lock()
	a.ctx = ctx
	a.ctxMu.Unlock()

	go func() {
		if err, ok := <-a.startupErrors; ok && err != nil {
			log.Printf("backend startup failed: %v", err)
			message := "Waybill could not start its local service.\n\n" + err.Error()
			if a.logPath != "" {
				message += "\n\nLog file: " + a.logPath
			}
			_, _ = runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
				Type:    runtime.ErrorDialog,
				Title:   "Waybill startup error",
				Message: message,
			})
		}
	}()
}

func (a *App) focusWindow() {
	a.ctxMu.RLock()
	ctx := a.ctx
	a.ctxMu.RUnlock()
	if ctx == nil {
		return
	}
	runtime.WindowUnminimise(ctx)
	runtime.WindowShow(ctx)
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) DownloadFile(base64Data string, filename string) error {
	data, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		return err
	}

	filePath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		DefaultFilename: filename,
		Title:           "Save File",
		Filters: []runtime.FileFilter{
			{DisplayName: "Excel Files (*.csv)", Pattern: "*.csv"},
		},
	})
	if err != nil || filePath == "" {
		return nil
	}

	return os.WriteFile(filePath, data, 0644)
}
