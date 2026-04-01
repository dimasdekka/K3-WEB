package main

import (
	"log"

	"github.com/fonusa/k3-backend/internal/config"
	"github.com/fonusa/k3-backend/internal/handler"
	"github.com/fonusa/k3-backend/internal/repository"
	"github.com/fonusa/k3-backend/internal/service"
	"github.com/gin-gonic/gin"
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

	// Dependency Injection
	wpRepo := repository.NewWorkPermitRepository(db)
	jsaRepo := repository.NewJSARepository(db)

	pdfSvc := service.NewPDFService()

	wpSvc := service.NewWorkPermitService(wpRepo)
	jsaSvc := service.NewJSAService(jsaRepo)

	wpHandler := handler.NewWorkPermitHandler(wpSvc, pdfSvc)
	jsaHandler := handler.NewJSAHandler(jsaSvc, pdfSvc)

	// Router setup
	r := gin.Default()

	// API Groups
	v1 := r.Group("/api/v1")
	{
		permits := v1.Group("/work-permits")
		{
			permits.POST("", wpHandler.Create)
			permits.GET("", wpHandler.List)
			permits.GET("/:id", wpHandler.GetByID)
			permits.GET("/:id/pdf", wpHandler.DownloadPDF)
			permits.POST("/:id/approve/manager", wpHandler.ApproveManager)
			permits.POST("/:id/approve/k3", wpHandler.ApproveK3)
		}

		jsaGroup := v1.Group("/jsa")
		{
			jsaGroup.POST("", jsaHandler.Create)
			jsaGroup.GET("", jsaHandler.List)
			jsaGroup.GET("/:id", jsaHandler.GetByID)
			jsaGroup.GET("/:id/pdf", jsaHandler.DownloadPDF)
			jsaGroup.POST("/:id/approve/k3", jsaHandler.ApproveK3)
		}
	}

	log.Println("Started Server loosely on port 8080. Ready for requests.")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Error running server: %v", err)
	}
}
