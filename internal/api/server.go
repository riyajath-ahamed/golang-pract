package api

import (
	"context"
	"golang-asses/internal/config"
	"golang-asses/internal/store"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func StartServer(metrics config.Metrics, store *store.AnalyticsStore) {
	app := echo.New()

	app.Use(middleware.Logger())
	app.Use(middleware.Recover())
	app.Use(middleware.Gzip())

	registerRoutes(app, store)

	app.Logger.Info("server started on port 8080")

	go func() {
		if err := app.Start(":8080"); err != nil {
			app.Logger.Info("shutting down server")
		}

		// app.Logger.Info("server started on port 8080 and metrics: %+v", metrics)

	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	app.Shutdown(ctx)
}
