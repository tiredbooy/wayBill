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
	domReady      chan struct{}
	domReadyOnce  sync.Once
	startupErrors <-chan error
	logPath       string
}

// NewApp creates a new App application struct
func NewApp(startupErrors <-chan error, logPath string) *App {
	return &App{
		domReady:      make(chan struct{}),
		startupErrors: startupErrors,
		logPath:       logPath,
	}
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
			// Wails runtime calls are only guaranteed to be safe after the DOM is
			// ready. A fast database/server failure can otherwise race window setup.
			<-a.domReady
			ctx := a.context()
			if ctx == nil {
				return
			}
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

func (a *App) onDomReady(ctx context.Context) {
	a.ctxMu.Lock()
	a.ctx = ctx
	a.ctxMu.Unlock()
	a.domReadyOnce.Do(func() { close(a.domReady) })
}

func (a *App) focusWindow() {
	ctx := a.context()
	if ctx == nil {
		return
	}
	runtime.WindowUnminimise(ctx)
	runtime.WindowShow(ctx)
}

func (a *App) context() context.Context {
	a.ctxMu.RLock()
	defer a.ctxMu.RUnlock()
	return a.ctx
}

// Print opens the native print dialog for the current Wails window.
// WindowPrint is a Go-only runtime API in Wails v2, so the frontend calls this
// bound method instead of looking for a non-existent window.runtime function.
func (a *App) Print() error {
	ctx := a.context()
	if ctx == nil {
		return fmt.Errorf("application window is not ready")
	}
	runtime.WindowPrint(ctx)
	return nil
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

	ctx := a.context()
	if ctx == nil {
		return fmt.Errorf("application window is not ready")
	}

	filePath, err := runtime.SaveFileDialog(ctx, runtime.SaveDialogOptions{
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
