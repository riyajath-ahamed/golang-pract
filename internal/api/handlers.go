package api

import (
	"golang-asses/internal/store"
	"net/http"
	"sort"

	"github.com/labstack/echo/v4"
)

func RevenueByCountry(s *store.AnalyticsStore) echo.HandlerFunc {
	return func(c echo.Context) error {
		var result []*store.CountryProductRevenue

		for _, products := range s.CountryProduct {
			for _, v := range products {
				result = append(result, v)
			}
		}

		sort.Slice(result, func(i, j int) bool {
			return result[i].TotalRevenue > result[j].TotalRevenue
		})

		return c.JSON(http.StatusOK, result)
	}
}

func TopProducts(s *store.AnalyticsStore) echo.HandlerFunc {
	type Resp struct {
		Product string
		Count   int
		Stock   int
	}

	var r []Resp
	limit := 20
	for p, c := range s.ProductCount {
		r = append(r, Resp{p, c, s.ProductStock[p]})
	}

	sort.Slice(r, func(i, j int) bool {
		return r[i].Count > r[j].Count
	})

	if len(r) > limit {
		r = r[:limit]
	}

	return func(c echo.Context) error {
		return c.JSON(http.StatusOK, r)
	}
}

func MonthlySales(s *store.AnalyticsStore) echo.HandlerFunc {
	type Resp struct {
		Month string `json:"month"`
		Sales int    `json:"sales"`
	}

	months := []string{
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December",
	}

	return func(c echo.Context) error {
		var result []Resp

		for i, sales := range s.MonthlySales {
			result = append(result, Resp{
				Month: months[i],
				Sales: sales,
			})
		}

		// Sort by highest sales
		sort.Slice(result, func(i, j int) bool {
			return result[i].Sales > result[j].Sales
		})

		return c.JSON(http.StatusOK, result)
	}
}

func TopRegions(s *store.AnalyticsStore) echo.HandlerFunc {
	type Resp struct {
		Region    string  `json:"region"`
		Revenue   float64 `json:"revenue"`
		ItemsSold int     `json:"items_sold"`
	}

	return func(c echo.Context) error {
		var result []Resp

		for _, v := range s.RegionStats {
			result = append(result, Resp{
				Region:    v.Region,
				Revenue:   v.Revenue,
				ItemsSold: v.ItemsSold,
			})
		}

		// Sort by revenue desc
		sort.Slice(result, func(i, j int) bool {
			return result[i].Revenue > result[j].Revenue
		})

		// Top 30 only
		if len(result) > 30 {
			result = result[:30]
		}

		return c.JSON(http.StatusOK, result)
	}
}
