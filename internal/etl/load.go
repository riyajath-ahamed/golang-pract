package etl

import (
	"golang-asses/internal/models"
	"golang-asses/internal/store"
)

func Aggregate(in <-chan []models.Transaction, store *store.AnalyticsStore) {
	for batch := range in {
		for _, txn := range batch {
			store.Add(txn)
		}
	}
}
