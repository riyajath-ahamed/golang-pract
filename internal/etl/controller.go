package etl

import (
	"fmt"
	"golang-asses/internal/config"
	"golang-asses/internal/models"
	"golang-asses/internal/store"
	"time"
)

func Run(cfg config.ETLConfig, store *store.AnalyticsStore) error {

	cfg.Metrics.StartTime = time.Now()
	cfg.Metrics.IsRunning = true
	cfg.Metrics.RowsProcessed = 0

	fmt.Println("========== ETL Started ==========")
	fmt.Printf("Start Time: %s\n", cfg.Metrics.StartTime.Format(time.DateTime))
	fmt.Printf("Workers: %d\n", cfg.Workers)
	fmt.Printf("Batch Size: %d\n", cfg.BatchSize)
	fmt.Println("==================================")

	extractCh := make(chan []models.Transaction, cfg.Workers*2)
	aggregateCh := make(chan []models.Transaction, cfg.Workers*2)

	go Extract(cfg, extractCh)
	StartTrasformWorkers(cfg, extractCh, aggregateCh)

	for batch := range aggregateCh {
		for _, t := range batch {
			store.Add(t)
			cfg.Metrics.RowsProcessed++
		}
	}

	cfg.Metrics.EndTime = time.Now()
	cfg.Metrics.Duration = cfg.Metrics.EndTime.Sub(cfg.Metrics.StartTime)
	cfg.Metrics.IsRunning = false

	fmt.Println("========== ETL Completed ==========")
	fmt.Printf("End Time: %s\n", cfg.Metrics.EndTime.Format(time.DateTime))
	fmt.Printf("Duration: %s\n", cfg.Metrics.Duration)
	fmt.Printf("Rows Processed: %d\n", cfg.Metrics.RowsProcessed)
	fmt.Println("====================================")

	return nil
}
