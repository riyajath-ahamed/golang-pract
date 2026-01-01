package config

import (
	"runtime"
	"time"
)

type Metrics struct {
	RowsProcessed int       `json:"rows_processed"`
	StartTime     time.Time `json:"start_time"`
}

type ETLConfig struct {
	Workers   int
	BatchSize int
	DataPath  string
	Metrics   Metrics
}

func DefaultETLConfig() ETLConfig {
	return ETLConfig{
		Workers:   runtime.NumCPU(),
		BatchSize: 1000,
		DataPath:  "data/GO_test_5m.csv",
		Metrics: Metrics{
			RowsProcessed: 0,
			StartTime:     time.Now(),
		},
	}

}
