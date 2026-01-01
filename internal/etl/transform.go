package etl

import (
	"golang-asses/internal/config"
	"golang-asses/internal/models"
	"sync"
)

func StartTrasformWorkers(
	cfg config.ETLConfig,
	in <-chan []models.Transaction,
	out chan<- []models.Transaction,
) {
	var waitGroup sync.WaitGroup

	for i := 0; i < cfg.Workers; i++ {
		waitGroup.Add(1)
		go func() {
			defer waitGroup.Done()
			for batch := range in {
				for i := range batch {
					normalize(&batch[i])
				}
				out <- batch
			}
		}()
	}

	go func() {
		waitGroup.Wait()
		close(out)
	}()
}
