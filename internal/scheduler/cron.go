package scheduler

import (
	"golang-asses/internal/config"
	"golang-asses/internal/etl"
	"golang-asses/internal/store"

	"github.com/robfig/cron/v3"
)

func StartCron(cfg config.ETLConfig, store *store.AnalyticsStore) {

	cronJob := cron.New()
	cronJob.AddFunc("@every 12h", func() {
		etl.Run(cfg, store)
	})

	cronJob.Start()

	etl.Run(cfg, store)

	select {}

}
