package store

import (
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"sync"
)

const (
	DataDir            = "data/aggregated"
	CountryProductFile = "country_product_revenue.csv"
	ProductCountFile   = "product_count.csv"
	ProductStockFile   = "product_stock.csv"
	MonthlySalesFile   = "monthly_sales.csv"
	RegionStatsFile    = "region_stats.csv"
)

func ensureDataDir() error {
	return os.MkdirAll(DataDir, 0755)
}

// SaveToCSV saves all aggregated data from memory to CSV files
func (s *AnalyticsStore) SaveToCSV() error {
	if err := ensureDataDir(); err != nil {
		return fmt.Errorf("failed to create data directory: %w", err)
	}

	var wg sync.WaitGroup
	errCh := make(chan error, 5)

	wg.Add(5)

	go func() {
		defer wg.Done()
		if err := s.saveCountryProduct(); err != nil {
			errCh <- err
		}
	}()

	go func() {
		defer wg.Done()
		if err := s.saveProductCount(); err != nil {
			errCh <- err
		}
	}()

	go func() {
		defer wg.Done()
		if err := s.saveProductStock(); err != nil {
			errCh <- err
		}
	}()

	go func() {
		defer wg.Done()
		if err := s.saveMonthlySales(); err != nil {
			errCh <- err
		}
	}()

	go func() {
		defer wg.Done()
		if err := s.saveRegionStats(); err != nil {
			errCh <- err
		}
	}()

	wg.Wait()
	close(errCh)

	for err := range errCh {
		if err != nil {
			return err
		}
	}

	return nil
}

// ClearMemory clears all in-memory data after saving to CSV
func (s *AnalyticsStore) ClearMemory() {
	s.CountryProduct = make(map[string]map[string]*CountryProductRevenue)
	s.ProductCount = make(map[string]int)
	s.ProductStock = make(map[string]int)
	s.MonthlySales = [12]int{}
	s.RegionStats = make(map[string]*RegionRevenue)
}

// saveCountryProduct saves country-product revenue data to CSV
func (s *AnalyticsStore) saveCountryProduct() error {
	filePath := filepath.Join(DataDir, CountryProductFile)
	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("failed to create %s: %w", CountryProductFile, err)
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write header
	if err := writer.Write([]string{"country", "product_name", "total_revenue", "transactions", "transaction_count"}); err != nil {
		return err
	}

	// Write data
	for country, products := range s.CountryProduct {
		for _, p := range products {
			record := []string{
				country,
				p.ProductName,
				strconv.FormatFloat(p.TotalRevenue, 'f', 2, 64),
				strconv.Itoa(p.Transactions),
				strconv.Itoa(p.TransactionCount),
			}
			if err := writer.Write(record); err != nil {
				return err
			}
		}
	}

	return nil
}

// saveProductCount saves product count data to CSV
func (s *AnalyticsStore) saveProductCount() error {
	filePath := filepath.Join(DataDir, ProductCountFile)
	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("failed to create %s: %w", ProductCountFile, err)
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	if err := writer.Write([]string{"product_name", "count"}); err != nil {
		return err
	}

	for product, count := range s.ProductCount {
		if err := writer.Write([]string{product, strconv.Itoa(count)}); err != nil {
			return err
		}
	}

	return nil
}

// saveProductStock saves product stock data to CSV
func (s *AnalyticsStore) saveProductStock() error {
	filePath := filepath.Join(DataDir, ProductStockFile)
	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("failed to create %s: %w", ProductStockFile, err)
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	if err := writer.Write([]string{"product_name", "stock"}); err != nil {
		return err
	}

	for product, stock := range s.ProductStock {
		if err := writer.Write([]string{product, strconv.Itoa(stock)}); err != nil {
			return err
		}
	}

	return nil
}

// saveMonthlySales saves monthly sales data to CSV
func (s *AnalyticsStore) saveMonthlySales() error {
	filePath := filepath.Join(DataDir, MonthlySalesFile)
	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("failed to create %s: %w", MonthlySalesFile, err)
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	if err := writer.Write([]string{"month_index", "sales"}); err != nil {
		return err
	}

	for i, sales := range s.MonthlySales {
		if err := writer.Write([]string{strconv.Itoa(i), strconv.Itoa(sales)}); err != nil {
			return err
		}
	}

	return nil
}

// saveRegionStats saves region stats data to CSV
func (s *AnalyticsStore) saveRegionStats() error {
	filePath := filepath.Join(DataDir, RegionStatsFile)
	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("failed to create %s: %w", RegionStatsFile, err)
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	if err := writer.Write([]string{"region", "revenue", "items_sold"}); err != nil {
		return err
	}

	for _, rs := range s.RegionStats {
		record := []string{
			rs.Region,
			strconv.FormatFloat(rs.Revenue, 'f', 2, 64),
			strconv.Itoa(rs.ItemsSold),
		}
		if err := writer.Write(record); err != nil {
			return err
		}
	}

	return nil
}

// LoadCountryProductFromCSV loads country-product data from CSV
func LoadCountryProductFromCSV() (map[string]map[string]*CountryProductRevenue, error) {
	filePath := filepath.Join(DataDir, CountryProductFile)
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open %s: %w", CountryProductFile, err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to read %s: %w", CountryProductFile, err)
	}

	result := make(map[string]map[string]*CountryProductRevenue)

	// Skip header
	for i := 1; i < len(records); i++ {
		record := records[i]
		country := record[0]
		productName := record[1]
		totalRevenue, _ := strconv.ParseFloat(record[2], 64)
		transactions, _ := strconv.Atoi(record[3])
		transactionCount, _ := strconv.Atoi(record[4])

		if _, ok := result[country]; !ok {
			result[country] = make(map[string]*CountryProductRevenue)
		}

		result[country][productName] = &CountryProductRevenue{
			Country:          country,
			ProductName:      productName,
			TotalRevenue:     totalRevenue,
			Transactions:     transactions,
			TransactionCount: transactionCount,
		}
	}

	return result, nil
}

// LoadProductCountFromCSV loads product count data from CSV
func LoadProductCountFromCSV() (map[string]int, error) {
	filePath := filepath.Join(DataDir, ProductCountFile)
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open %s: %w", ProductCountFile, err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to read %s: %w", ProductCountFile, err)
	}

	result := make(map[string]int)

	for i := 1; i < len(records); i++ {
		record := records[i]
		product := record[0]
		count, _ := strconv.Atoi(record[1])
		result[product] = count
	}

	return result, nil
}

// LoadProductStockFromCSV loads product stock data from CSV
func LoadProductStockFromCSV() (map[string]int, error) {
	filePath := filepath.Join(DataDir, ProductStockFile)
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open %s: %w", ProductStockFile, err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to read %s: %w", ProductStockFile, err)
	}

	result := make(map[string]int)

	for i := 1; i < len(records); i++ {
		record := records[i]
		product := record[0]
		stock, _ := strconv.Atoi(record[1])
		result[product] = stock
	}

	return result, nil
}

// LoadMonthlySalesFromCSV loads monthly sales data from CSV
func LoadMonthlySalesFromCSV() ([12]int, error) {
	var result [12]int

	filePath := filepath.Join(DataDir, MonthlySalesFile)
	file, err := os.Open(filePath)
	if err != nil {
		return result, fmt.Errorf("failed to open %s: %w", MonthlySalesFile, err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return result, fmt.Errorf("failed to read %s: %w", MonthlySalesFile, err)
	}

	for i := 1; i < len(records); i++ {
		record := records[i]
		monthIdx, _ := strconv.Atoi(record[0])
		sales, _ := strconv.Atoi(record[1])
		if monthIdx >= 0 && monthIdx < 12 {
			result[monthIdx] = sales
		}
	}

	return result, nil
}

// LoadRegionStatsFromCSV loads region stats data from CSV
func LoadRegionStatsFromCSV() (map[string]*RegionRevenue, error) {
	filePath := filepath.Join(DataDir, RegionStatsFile)
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open %s: %w", RegionStatsFile, err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to read %s: %w", RegionStatsFile, err)
	}

	result := make(map[string]*RegionRevenue)

	for i := 1; i < len(records); i++ {
		record := records[i]
		region := record[0]
		revenue, _ := strconv.ParseFloat(record[1], 64)
		itemsSold, _ := strconv.Atoi(record[2])

		result[region] = &RegionRevenue{
			Region:    region,
			Revenue:   revenue,
			ItemsSold: itemsSold,
		}
	}

	return result, nil
}

// CSVDataExists checks if all CSV files exist
func CSVDataExists() bool {
	files := []string{
		filepath.Join(DataDir, CountryProductFile),
		filepath.Join(DataDir, ProductCountFile),
		filepath.Join(DataDir, ProductStockFile),
		filepath.Join(DataDir, MonthlySalesFile),
		filepath.Join(DataDir, RegionStatsFile),
	}

	for _, f := range files {
		if _, err := os.Stat(f); os.IsNotExist(err) {
			return false
		}
	}

	return true
}
