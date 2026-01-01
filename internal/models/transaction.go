package models

import "time"

type Transaction struct {
	Country  string
	Product  string
	Region   string
	Revenue  float64
	Quantity int
	RawDate  string
	Date     time.Time
}
