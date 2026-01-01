package api

import (
	"golang-asses/internal/store"
	"net/http"

	"github.com/labstack/echo/v4"
)

func RevenueByCountry(store *store.AnalyticsStore) echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.JSON(http.StatusOK, store.RevenueByCountry)
	}
}

func GetTopProducts(store *store.AnalyticsStore) echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.JSON(http.StatusOK, store.ProductCount)
	}
}

func GetTopRegions(store *store.AnalyticsStore) echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.JSON(http.StatusOK, store.RegionRevenue)
	}
}

func GetMonthlySales(store *store.AnalyticsStore) echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.JSON(http.StatusOK, store.MonthlySales)
	}
}
