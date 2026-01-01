package etl

import (
	"bufio"
	"encoding/csv"
	"golang-asses/internal/config"
	"golang-asses/internal/models"
	"io"
	"os"
	"strconv"
)

func parseRecord(record []string) models.Transaction {
	revenue, _ := strconv.ParseFloat(record[10], 64)
	quantity, _ := strconv.Atoi(record[9])

	return models.Transaction{
		Country:  record[3],
		Product:  record[6],
		Region:   record[4],
		Revenue:  revenue,
		Quantity: quantity,
		RawDate:  record[1],
	}
}

func Extract(cfg config.ETLConfig, out chan<- []models.Transaction) {

	defer close(out)

	file, _ := os.Open(cfg.DataPath)
	reader := csv.NewReader(bufio.NewReader(file))

	_, _ = reader.Read()

	batch := make([]models.Transaction, 0, cfg.BatchSize)

	for {
		record, err := reader.Read()
		if err == io.EOF {
			if len(batch) > 0 {
				out <- batch
			}
			return
		}

		batch = append(batch, parseRecord(record))
		if len(batch) == cfg.BatchSize {
			out <- batch
			batch = make([]models.Transaction, 0, cfg.BatchSize)
		}
	}

}
