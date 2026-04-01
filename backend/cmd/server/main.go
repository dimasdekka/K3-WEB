package main

import (
	"log"

	"github.com/fonusa/k3-backend/internal/config"
)

func main() {
	log.Println("Initializing K3 Web Backend...")

	db, err := config.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer func() {
		sqlDB, err := db.DB()
		if err == nil {
			_ = sqlDB.Close()
		}
	}()

	log.Println("Database connection established and migrations generated.")
	
	// TODO: Setup Fiber/Gin/Echo/net-http and routing router here.
	// For now we will just verify the connection.
	log.Println("Backend initialization complete (Phase 1).")
}
