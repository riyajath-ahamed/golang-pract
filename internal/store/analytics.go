package store

import "golang-asses/internal/models"

type AnalyticsStore struct {
	RevenueByCountry map[string]float64
	ProductCount     map[string]int
	RegionRevenue    map[string]float64
	MonthlySales     [12]int
}

func NewAnalyticsStore() *AnalyticsStore {
	return &AnalyticsStore{
		RevenueByCountry: make(map[string]float64),
		ProductCount:     make(map[string]int),
		RegionRevenue:    make(map[string]float64),
	}
}

func (s *AnalyticsStore) Add(txn models.Transaction) {
	s.RevenueByCountry[txn.Country] += txn.Revenue
	s.ProductCount[txn.Product] += txn.Quantity
	s.RegionRevenue[txn.Region] += txn.Revenue
	s.MonthlySales[txn.Date.Month()-1]++

}
