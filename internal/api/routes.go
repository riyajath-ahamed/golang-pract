package api

import (
	"golang-asses/internal/config"
	"golang-asses/internal/store"
	"net/http"

	"github.com/labstack/echo/v4"
)

func registerRoutes(e *echo.Echo, store *store.AnalyticsStore, cfg *config.Metrics) {
	api := e.Group("/api")

	api.GET("/revenue-by-country", RevenueByCountry(store, cfg))
	api.GET("/top-products", TopProducts(store, cfg))
	api.GET("/monthly-sales", MonthlySales(store, cfg))
	api.GET("/top-regions", TopRegions(store, cfg))

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status":  "ok",
			"message": "API is running",
		})
	})
}
