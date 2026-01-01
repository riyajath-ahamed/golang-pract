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
	t.Product = strings.TrimSpace(t.Product)
	t.Region = strings.ToUpper(strings.TrimSpace(t.Region))

	if t.Revenue < 0 {
		t.Revenue = 0
	}
	if t.Quantity < 0 {
		t.Quantity = 0
	}

	if t.Date.IsZero() && t.RawDate != "" {
		t.Date, _ = time.Parse(dateLayout, t.RawDate)
	}
}
