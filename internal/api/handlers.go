package api

import (
	"golang-asses/internal/store"
	"net/http"
	"sort"
	"strconv"

	"github.com/labstack/echo/v4"
)

func RevenueByCountry(s *store.AnalyticsStore) echo.HandlerFunc {
	return func(c echo.Context) error {

		page, _ := strconv.Atoi(c.QueryParam("page"))
		pageSize, _ := strconv.Atoi(c.QueryParam("page_size"))
		sortBy := c.QueryParam("sort_by")
		order := c.QueryParam("order")

		if page <= 0 {
			page = 1
		}
		if pageSize <= 0 || pageSize > 100 {
			pageSize = 20
		}
		if sortBy == "" {
			sortBy = "total_revenue"
		}
		if order == "" {
			order = "desc"
		}

		var result []*store.CountryProductRevenue
		for _, products := range s.CountryProduct {
			for _, v := range products {
				result = append(result, v)
			}
		}

		sort.Slice(result, func(i, j int) bool {
			var less bool

			switch sortBy {
			case "transactions":
				less = result[i].TransactionCount < result[j].TransactionCount
			default: // total_revenue
				less = result[i].TotalRevenue < result[j].TotalRevenue
			}

			if order == "asc" {
				return less
			}
			return !less
		})

		totalItems := len(result)
		start := (page - 1) * pageSize
		end := start + pageSize

		if start >= totalItems {
			result = []*store.CountryProductRevenue{}
		} else {
			if end > totalItems {
				end = totalItems
			}
			result = result[start:end]
		}

		return c.JSON(http.StatusOK, map[string]interface{}{
			"page":        page,
			"page_size":   pageSize,
			"total_items": totalItems,
			"data":        result,
		})
	}
}

func TopProducts(s *store.AnalyticsStore) echo.HandlerFunc {
	type Resp struct {
		Product string
		Count   int
		Stock   int
	}

	return func(c echo.Context) error {
		// fmt.Println("ProductCount", s.ProductCount)
		// fmt.Println("ProductStock", s.ProductStock)

		var r []Resp
		limit := 20
		for p, cnt := range s.ProductCount {
			r = append(r, Resp{p, cnt, s.ProductStock[p]})
		}

		sort.Slice(r, func(i, j int) bool {
			return r[i].Count > r[j].Count
		})

		if len(r) > limit {
			r = r[:limit]
		}

		return c.JSON(http.StatusOK, map[string]interface{}{
			"page":        1,
			"page_size":   20,
			"total_items": len(r),
			"data":        r,
		})
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

		return c.JSON(http.StatusOK, map[string]interface{}{
			"page":        1,
			"page_size":   12,
			"total_items": len(result),
			"data":        result,
		})
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

		return c.JSON(http.StatusOK, map[string]interface{}{
			"page":        1,
			"page_size":   30,
			"total_items": len(result),
			"data":        result,
		})
	}
}
