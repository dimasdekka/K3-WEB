package service

import (
	"context"
	"fmt"
	"time"

	"github.com/fonusa/k3-backend/internal/domain"
	"github.com/fonusa/k3-backend/internal/repository"
)

type JSAService interface {
	CreateJSA(ctx context.Context, jsa *domain.JSA) error
	GetJSA(ctx context.Context, id uint) (*domain.JSA, error)
	ListJSAs(ctx context.Context) ([]domain.JSA, error)
	ApproveByK3(ctx context.Context, jsaID uint, k3OfficerID uint) error
}

type jsaService struct {
	repo repository.JSARepository
}

func NewJSAService(repo repository.JSARepository) JSAService {
	return &jsaService{repo: repo}
}

func (s *jsaService) CreateJSA(ctx context.Context, jsa *domain.JSA) error {
	// Generate unique JSA ID tracking
	jsa.JobNumber = fmt.Sprintf("JSA-%d", time.Now().UnixNano())
	
	// Phase 3 Default: Straight to K3 review
	jsa.Status = domain.JSAStatusWaitingK3 
	
	// Sanitize Sequence for robust UI rendering
	for i := range jsa.AnalysisSteps {
		jsa.AnalysisSteps[i].Sequence = i + 1
	}

	return s.repo.Create(ctx, jsa)
}

func (s *jsaService) GetJSA(ctx context.Context, id uint) (*domain.JSA, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *jsaService) ListJSAs(ctx context.Context) ([]domain.JSA, error) {
	return s.repo.ListAll(ctx)
}

func (s *jsaService) ApproveByK3(ctx context.Context, jsaID uint, k3OfficerID uint) error {
	now := time.Now()
	updaters := map[string]interface{}{
		"K3OfficerID":     k3OfficerID,
		"K3OfficerApprov": now,
	}
	return s.repo.UpdateStatus(ctx, jsaID, domain.JSAStatusApproved, updaters)
}
