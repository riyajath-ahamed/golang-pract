package store

import (
	"golang-asses/internal/models"
)

type CountryProductRevenue struct {
	Country      string
	ProductName  string
	TotalRevenue float64
	Transactions int
}

type RegionRevenue struct {
	Region    string
	Revenue   float64
	ItemsSold int
}

type AnalyticsStore struct {
	CountryProduct map[string]map[string]*CountryProductRevenue
	ProductCount   map[string]int
	ProductStock   map[string]int
	MonthlySales   [12]int
	RegionStats    map[string]*RegionRevenue
}

func NewAnalyticsStore() *AnalyticsStore {
	return &AnalyticsStore{
		CountryProduct: make(map[string]map[string]*CountryProductRevenue),
		ProductCount:   make(map[string]int),
		ProductStock:   make(map[string]int),
		RegionStats:    make(map[string]*RegionRevenue),
	}
}

func (s *AnalyticsStore) Add(t models.Transaction) {
	if _, ok := s.CountryProduct[t.Country]; !ok {
		s.CountryProduct[t.Country] = make(map[string]*CountryProductRevenue)
	}

	cp := s.CountryProduct[t.Country][t.ProductName]
	if cp == nil {
		cp = &CountryProductRevenue{
			Country:     t.Country,
			ProductName: t.ProductName,
		}
		s.CountryProduct[t.Country][t.ProductName] = cp
	}
	cp.TotalRevenue += t.TotalPrice
	cp.Transactions++

	s.ProductCount[t.ProductName] += t.Quantity
	s.ProductStock[t.ProductName] = t.StockQuantity

	if !t.TransactionDate.IsZero() {
		s.MonthlySales[t.TransactionDate.Month()-1] += t.Quantity
	}

	rs := s.RegionStats[t.Region]
	if rs == nil {
		rs = &RegionRevenue{Region: t.Region}
		s.RegionStats[t.Region] = rs
	}
	rs.Revenue += t.TotalPrice
	rs.ItemsSold += t.Quantity
}
