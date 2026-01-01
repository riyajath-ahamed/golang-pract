package models

import "time"

type Transaction struct {
	TransactionID string
	UserID        string

	Country     string
	Region      string
	ProductID   string
	ProductName string
	Category    string

	Price         float64
	Quantity      int
	TotalPrice    float64
	StockQuantity int

	TransactionDate time.Time
	AddedDate       time.Time

	RawTransactionDate string
}
