package config

import (
	"runtime"
	"time"
)

type Metrics struct {
	RowsProcessed int           `json:"rows_processed"`
	StartTime     time.Time     `json:"start_time"`
	EndTime       time.Time     `json:"end_time"`
	Duration      time.Duration `json:"duration"`
	IsRunning     bool          `json:"is_running"`
}

type ETLConfig struct {
	Workers   int
	BatchSize int
	DataPath  string
	Metrics   *Metrics
}

func DefaultETLConfig() ETLConfig {
	return ETLConfig{
		Workers:   runtime.NumCPU(),
		BatchSize: 2000,
		DataPath:  "data/GO_test_5m.csv",
		Metrics: &Metrics{
			RowsProcessed: 0,
		},
	}
}
