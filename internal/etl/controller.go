package etl

import (
	"golang-asses/internal/config"
	"golang-asses/internal/models"
	"golang-asses/internal/store"
)

func Run(cfg config.ETLConfig, store *store.AnalyticsStore) error {

	extractCh := make(chan []models.Transaction, cfg.Workers*2)
	aggregateCh := make(chan []models.Transaction, cfg.Workers*2)

	go Extract(cfg, extractCh)
	StartTrasformWorkers(cfg, extractCh, aggregateCh)

	for batch := range aggregateCh {
		for _, t := range batch {
			store.Add(t)
		}
	}

	return nil
	//TODO: error handling

}
