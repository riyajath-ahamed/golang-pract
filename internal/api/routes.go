package api

import (
	"golang-asses/internal/store"
	"net/http"

	"github.com/labstack/echo/v4"
)

func registerRoutes(e *echo.Echo, store *store.AnalyticsStore) {
	api := e.Group("/api")

	api.GET("/revenue-by-country", RevenueByCountry(store))
	api.GET("/top-products", TopProducts(store))
	api.GET("/monthly-sales", MonthlySales(store))
	api.GET("/top-regions", TopRegions(store))

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status":  "ok",
			"message": "API is running",
		})
	})
}
