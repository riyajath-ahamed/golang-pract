package main

import (
	"golang-asses/internal/api"
	"golang-asses/internal/config"
	"golang-asses/internal/scheduler"
	"golang-asses/internal/store"
	"runtime"
)

func main() {

	runtime.GOMAXPROCS(runtime.NumCPU())

	cfg := config.DefaultETLConfig()
	store := store.NewAnalyticsStore()

	go scheduler.StartCron(cfg, store)

	api.StartServer(cfg.Metrics, store)

}
