package api

import (
	"golang-asses/internal/store"
	"net/http"

	"github.com/labstack/echo/v4"
)

func registerRoutes(e *echo.Echo, store *store.AnalyticsStore) {
	api := e.Group("/api")

	api.GET("/revenue-by-country", RevenueByCountry(store))
	api.GET("/products/top", GetTopProducts(store))
	api.GET("/regions/top", GetTopRegions(store))
	api.GET("/sales/monthly", GetMonthlySales(store))

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status":  "ok",
			"message": "API is running",
		})
	})
}
