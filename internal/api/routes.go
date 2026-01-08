package api

import (
	"golang-asses/internal/config"
	"golang-asses/internal/store"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

func registerRoutes(e *echo.Echo, store *store.AnalyticsStore, cfg *config.Metrics) {
	api := e.Group("/api")

	api.GET("/revenue-by-country", RevenueByCountry(store, cfg))
	api.GET("/top-products", TopProducts(store, cfg))
	api.GET("/monthly-sales", MonthlySales(store, cfg))
	api.GET("/top-regions", TopRegions(store, cfg))

	e.GET("/health", func(c echo.Context) error {

		etlStatus := "ETL is running"
		if !cfg.IsRunning {
			etlStatus = "ETL is not running"
		}
		return c.JSON(http.StatusOK, map[string]string{
			"status":     "ok",
			"message":    "API is running",
			"etl_status": etlStatus,
		})
	})

	e.GET("/etl-status", func(c echo.Context) error {

		etlStatus := map[string]interface{}{
			"is_running":     cfg.IsRunning,
			"start_time":     cfg.StartTime.Format(time.DateTime),
			"end_time":       cfg.EndTime.Format(time.DateTime),
			"duration":       cfg.Duration.String(),
			"rows_processed": cfg.RowsProcessed,
		}

		return c.JSON(http.StatusOK, map[string]interface{}{
			"status":     "ok",
			"message":    "ETL status",
			"etl_status": etlStatus,
		})
	})
}
