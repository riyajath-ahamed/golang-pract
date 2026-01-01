package etl

import (
	"strings"
	"time"

	"golang-asses/internal/models"
)

var (
	dateLayout = "2006-01-02"
)

func normalize(t *models.Transaction) {
	t.Country = strings.ToUpper(strings.TrimSpace(t.Country))
	t.Region = strings.ToUpper(strings.TrimSpace(t.Region))
	t.ProductName = strings.TrimSpace(t.ProductName)

	if t.TransactionDate.IsZero() {
		if d, err := time.Parse(dateLayout, t.RawTransactionDate); err == nil {
			t.TransactionDate = d
		}
	}
}
