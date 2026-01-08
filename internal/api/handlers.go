package api

import (
	"golang-asses/internal/config"
	"golang-asses/internal/store"
	"net/http"
	"sort"
	"strconv"

	"github.com/labstack/echo/v4"
)

func RevenueByCountry(s *store.AnalyticsStore, cfg *config.Metrics) echo.HandlerFunc {

	return func(c echo.Context) error {
		isETLRunning := cfg.IsRunning
		if isETLRunning {
			return c.JSON(http.StatusServiceUnavailable, map[string]interface{}{
				"status":  "error",
				"code":    http.StatusServiceUnavailable,
				"message": "ETL is running, please try again later",
			})
		}

		// Load data from CSV instead of memory
		countryProduct, err := store.LoadCountryProductFromCSV()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"status":  "error",
				"code":    http.StatusInternalServerError,
				"message": "Failed to load data: " + err.Error(),
			})
		}

		var result []store.CountryRevenueResp

		page, _ := strconv.Atoi(c.QueryParam("page"))
		pageSize, _ := strconv.Atoi(c.QueryParam("limit"))
		sortBy := c.QueryParam("sortby")
		orderBy := c.QueryParam("ordery")
		productsLimit, _ := strconv.Atoi(c.QueryParam("products_limit"))

		if page <= 0 {
			page = 1
		}
		if pageSize <= 0 {
			pageSize = 10
		}
		if sortBy == "" {
			sortBy = "country"
		}
		if orderBy == "" {
			orderBy = "desc"
		}
		if productsLimit <= 0 {
			productsLimit = 3
		}

		for country, products := range countryProduct {
			var totalRevenue float64
			var totalTransactions int
			var productList []*store.CountryProductRevenue

			for _, p := range products {
				totalRevenue += p.TotalRevenue
				totalTransactions += p.TransactionCount
				productList = append(productList, p)
			}

			sort.Slice(productList, func(i, j int) bool {
				return productList[i].TotalRevenue > productList[j].TotalRevenue
			})
			totalProducts := len(productList)
			if len(productList) > productsLimit {
				productList = productList[:productsLimit]
			}

			result = append(result, store.CountryRevenueResp{
				Country:           country,
				TotalRevenue:      totalRevenue,
				TotalTransactions: totalTransactions,
				Products:          productList,
				TotalProducts:     totalProducts,
			})
		}

		sort.Slice(result, func(i, j int) bool {
			return result[i].TotalRevenue > result[j].TotalRevenue
		})

		return c.JSON(http.StatusOK, map[string]interface{}{
			"page":           page,
			"page_size":      pageSize,
			"total_items":    len(result),
			"products_limit": productsLimit,
			"data":           result,
		})
	}
}

func TopProducts(s *store.AnalyticsStore, cfg *config.Metrics) echo.HandlerFunc {
	type Resp struct {
		Product string
		Count   int
		Stock   int
	}

	return func(c echo.Context) error {
		isETLRunning := cfg.IsRunning
		if isETLRunning {
			return c.JSON(http.StatusServiceUnavailable, map[string]interface{}{
				"status":  "error",
				"code":    http.StatusServiceUnavailable,
				"message": "ETL is running, please try again later",
			})
		}

		// Load data from CSV instead of memory
		productCount, err := store.LoadProductCountFromCSV()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"status":  "error",
				"code":    http.StatusInternalServerError,
				"message": "Failed to load product count: " + err.Error(),
			})
		}

		productStock, err := store.LoadProductStockFromCSV()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"status":  "error",
				"code":    http.StatusInternalServerError,
				"message": "Failed to load product stock: " + err.Error(),
			})
		}

		var r []Resp
		limit := 20
		for p, cnt := range productCount {
			r = append(r, Resp{p, cnt, productStock[p]})
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

func MonthlySales(s *store.AnalyticsStore, cfg *config.Metrics) echo.HandlerFunc {
	type Resp struct {
		Month string `json:"month"`
		Sales int    `json:"sales"`
	}

	months := []string{
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December",
	}

	return func(c echo.Context) error {

		isETLRunning := cfg.IsRunning
		if isETLRunning {
			return c.JSON(http.StatusServiceUnavailable, map[string]interface{}{
				"status":  "error",
				"code":    http.StatusServiceUnavailable,
				"message": "ETL is running, please try again later",
			})
		}

		// Load data from CSV instead of memory
		monthlySales, err := store.LoadMonthlySalesFromCSV()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"status":  "error",
				"code":    http.StatusInternalServerError,
				"message": "Failed to load monthly sales: " + err.Error(),
			})
		}

		var result []Resp

		for i, sales := range monthlySales {
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

func TopRegions(s *store.AnalyticsStore, cfg *config.Metrics) echo.HandlerFunc {
	type Resp struct {
		Region    string  `json:"region"`
		Revenue   float64 `json:"revenue"`
		ItemsSold int     `json:"items_sold"`
	}

	return func(c echo.Context) error {
		isETLRunning := cfg.IsRunning
		if isETLRunning {
			return c.JSON(http.StatusServiceUnavailable, map[string]interface{}{
				"status":  "error",
				"code":    http.StatusServiceUnavailable,
				"message": "ETL is running, please try again later",
			})
		}

		// Load data from CSV instead of memory
		regionStats, err := store.LoadRegionStatsFromCSV()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"status":  "error",
				"code":    http.StatusInternalServerError,
				"message": "Failed to load region stats: " + err.Error(),
			})
		}

		var result []Resp

		for _, v := range regionStats {
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
