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
	t := models.Transaction{}

	if len(record) > 0 {
		t.TransactionID = record[0]
	}
	if len(record) > 1 {
		t.RawTransactionDate = record[1]
	}
	if len(record) > 2 {
		t.UserID = record[2]
	}
	if len(record) > 3 {
		t.Country = record[3]
	}
	if len(record) > 4 {
		t.Region = record[4]
	}
	if len(record) > 5 {
		t.ProductID = record[5]
	}
	if len(record) > 6 {
		t.ProductName = record[6]
	}
	if len(record) > 7 {
		t.Category = record[7]
	}
	if len(record) > 8 {
		t.Price, _ = strconv.ParseFloat(record[8], 64)
	}
	if len(record) > 9 {
		t.Quantity, _ = strconv.Atoi(record[9])
	}
	if len(record) > 10 {
		t.TotalPrice, _ = strconv.ParseFloat(record[10], 64)
	}
	if len(record) > 11 {
		t.StockQuantity, _ = strconv.Atoi(record[11])
	}

	return t
}

func Extract(cfg config.ETLConfig, out chan<- []models.Transaction) {

	defer close(out)

	file, _ := os.Open(cfg.DataPath)
	reader := csv.NewReader(bufio.NewReader(file))
	reader.ReuseRecord = true

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
