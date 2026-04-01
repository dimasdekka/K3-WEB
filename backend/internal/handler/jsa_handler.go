package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/fonusa/k3-backend/internal/domain"
	"github.com/fonusa/k3-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type JSAHandler struct {
	jsaService service.JSAService
	pdfService service.PDFService
}

func NewJSAHandler(jsaSvc service.JSAService, pdfSvc service.PDFService) *JSAHandler {
	return &JSAHandler{
		jsaService: jsaSvc,
		pdfService: pdfSvc,
	}
}

func (h *JSAHandler) Create(c *gin.Context) {
	var jsa domain.JSA
	if err := c.ShouldBindJSON(&jsa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSA Request object", "details": err.Error()})
		return
	}

	if err := h.jsaService.CreateJSA(c.Request.Context(), &jsa); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store JSA"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": jsa})
}

func (h *JSAHandler) List(c *gin.Context) {
	jsas, err := h.jsaService.ListJSAs(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve JSA lists"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": jsas})
}

func (h *JSAHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	jsa, err := h.jsaService.GetJSA(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "JSA not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": jsa})
}

func (h *JSAHandler) ApproveK3(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	k3ID := uint(2) // mocked K3 Officer Context

	if err := h.jsaService.ApproveByK3(c.Request.Context(), uint(id), k3ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve JSA"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "JSA securely approved by K3."})
}

func (h *JSAHandler) DownloadPDF(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	jsa, err := h.jsaService.GetJSA(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "JSA not found"})
		return
	}

	pdfBytes, err := h.pdfService.GenerateJSAPDF(c.Request.Context(), jsa)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to compile JSA PDF"})
		return
	}

	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"JSA-%s.pdf\"", jsa.JobNumber))
	c.Data(http.StatusOK, "application/pdf", pdfBytes)
}
