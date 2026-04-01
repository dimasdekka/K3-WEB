package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/fonusa/k3-backend/internal/domain"
	"github.com/fonusa/k3-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type PatrolHandler struct {
	patrolService service.PatrolService
	pdfService    service.PDFService
}

func NewPatrolHandler(patSvc service.PatrolService, pdfSvc service.PDFService) *PatrolHandler {
	return &PatrolHandler{
		patrolService: patSvc,
		pdfService:    pdfSvc,
	}
}

func (h *PatrolHandler) Create(c *gin.Context) {
	var patrol domain.PatrolK3
	if err := c.ShouldBindJSON(&patrol); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Patrol Check payload", "details": err.Error()})
		return
	}

	if err := h.patrolService.CreatePatrol(c.Request.Context(), &patrol); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to evaluate & save Patrol data"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": patrol})
}

func (h *PatrolHandler) List(c *gin.Context) {
	patrols, err := h.patrolService.ListPatrols(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch patrol history"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": patrols})
}

func (h *PatrolHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	patrol, err := h.patrolService.GetPatrol(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Patrol checklist missing"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patrol})
}

func (h *PatrolHandler) ApprovePIC(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	picID := uint(3) // mock role

	if err := h.patrolService.ApproveByPIC(c.Request.Context(), uint(id), picID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to append PIC approval"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "PIC approved the patrol findings."})
}

func (h *PatrolHandler) DownloadPDF(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	patrol, err := h.patrolService.GetPatrol(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Patrol form missing"})
		return
	}

	pdfBytes, err := h.pdfService.GeneratePatrolPDF(c.Request.Context(), patrol)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to compile the 15-category matrix into PDF"})
		return
	}

	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"PATROL-%s.pdf\"", patrol.PatrolNumber))
	c.Data(http.StatusOK, "application/pdf", pdfBytes)
}
