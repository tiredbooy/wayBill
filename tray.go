package main

import (
	"context"

	_ "embed"

	"github.com/getlantern/systray"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed icon.png
var iconData []byte

var trayCtx context.Context

func startTray(ctx context.Context) {
    trayCtx = ctx
    // systray.Run is blocking, so we run it in a goroutine
    systray.Register(onReady, onExit)
}

func onReady() {
    systray.SetIcon(iconData)
    systray.SetTitle("Waybill")
    systray.SetTooltip("Waybill - Running")

    mOpen := systray.AddMenuItem("Open Waybill", "Show the main window")
    mQuit := systray.AddMenuItem("Quit", "Exit the application")

    go func() {
        for {
            select {
            case <-mOpen.ClickedCh:
                runtime.WindowShow(trayCtx)   // show the hidden Wails window
            case <-mQuit.ClickedCh:
                systray.Quit()               // clean up tray
                runtime.Quit(trayCtx)        // close the app
            }
        }
    }()
}

func onExit() {
    // cleanup if needed
}