package config

import (
	"fmt"
	"log"
	"os"

	"github.com/fonusa/k3-backend/internal/domain"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// InitDB initializes PostgreSQL connection using gorm
func InitDB() (*gorm.DB, error) {
	// Typically you would read from env variables
	// Hardcoded fallback for Phase 1 local dev
	host := getEnv("DB_HOST", "127.0.0.1")
	user := getEnv("DB_USER", "root")
	password := getEnv("DB_PASSWORD", "password")
	dbname := getEnv("DB_NAME", "k3_db")
	port := getEnv("DB_PORT", "5433")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		host, user, password, dbname, port)

	log.Printf("Connecting to database: %s:%s", host, port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// AutoMigrate initial tables
	log.Println("Running AutoMigrate...")
	err = db.AutoMigrate(
		&domain.User{},
		&domain.WorkPermit{},
		&domain.WorkPermitPersonnel{},
		&domain.WorkPermitEquipment{},
		&domain.WorkPermitContaminationRisk{},
		&domain.JSA{},
		&domain.JSAAnalysisStep{},
		&domain.PatrolK3{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	return db, nil
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
