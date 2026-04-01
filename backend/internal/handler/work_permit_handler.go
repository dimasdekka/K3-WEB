package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/fonusa/k3-backend/internal/domain"
	"github.com/fonusa/k3-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type WorkPermitHandler struct {
	wpService  service.WorkPermitService
	pdfService service.PDFService
}

func NewWorkPermitHandler(wpService service.WorkPermitService, pdfService service.PDFService) *WorkPermitHandler {
	return &WorkPermitHandler{
		wpService:  wpService,
		pdfService: pdfService,
	}
}

func (h *WorkPermitHandler) Create(c *gin.Context) {
	var permit domain.WorkPermit
	if err := c.ShouldBindJSON(&permit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	if err := h.wpService.CreatePermit(c.Request.Context(), &permit); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create work permit"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": permit})
}

func (h *WorkPermitHandler) List(c *gin.Context) {
	permits, err := h.wpService.ListPermits(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list work permits"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": permits})
}

func (h *WorkPermitHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	permit, err := h.wpService.GetPermit(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Work permit not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": permit})
}

func (h *WorkPermitHandler) DownloadPDF(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	permit, err := h.wpService.GetPermit(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Work permit not found"})
		return
	}

	pdfBytes, err := h.pdfService.GenerateWorkPermitPDF(c.Request.Context(), permit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF document"})
		return
	}

	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"IjinKerja-%s.pdf\"", permit.PermitNumber))
	c.Data(http.StatusOK, "application/pdf", pdfBytes)
}

func (h *WorkPermitHandler) ApproveManager(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// TODO: extract actual User ID from JWT context
	managerID := uint(1) // mocked for Phase 2 scaffold

	if err := h.wpService.ApproveByManager(c.Request.Context(), uint(id), managerID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve permit"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully approved by Manager Area"})
}

func (h *WorkPermitHandler) ApproveK3(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// TODO: extract actual User ID from JWT context
	k3ID := uint(2) // mocked for Phase 2 scaffold

	if err := h.wpService.ApproveByK3(c.Request.Context(), uint(id), k3ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve permit"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully approved by K3 Officer"})
}
