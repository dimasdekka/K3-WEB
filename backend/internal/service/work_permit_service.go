package service

import (
	"context"
	"fmt"
	"time"

	"github.com/fonusa/k3-backend/internal/domain"
	"github.com/fonusa/k3-backend/internal/repository"
)

type WorkPermitService interface {
	CreatePermit(ctx context.Context, permit *domain.WorkPermit) error
	GetPermit(ctx context.Context, id uint) (*domain.WorkPermit, error)
	ListPermits(ctx context.Context) ([]domain.WorkPermit, error)
	ApproveByManager(ctx context.Context, permitID uint, managerID uint) error
	ApproveByK3(ctx context.Context, permitID uint, k3OfficerID uint) error
	RejectPermit(ctx context.Context, permitID uint) error
}

type workPermitService struct {
	repo repository.WorkPermitRepository
}

func NewWorkPermitService(repo repository.WorkPermitRepository) WorkPermitService {
	return &workPermitService{repo: repo}
}

func (s *workPermitService) CreatePermit(ctx context.Context, permit *domain.WorkPermit) error {
	// Standardize generated number temporarily
	permit.PermitNumber = fmt.Sprintf("WP-%d", time.Now().UnixNano())
	permit.Status = domain.PermitStatusWaitingManager
	return s.repo.Create(ctx, permit)
}

func (s *workPermitService) GetPermit(ctx context.Context, id uint) (*domain.WorkPermit, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *workPermitService) ListPermits(ctx context.Context) ([]domain.WorkPermit, error) {
	return s.repo.ListAll(ctx)
}

func (s *workPermitService) ApproveByManager(ctx context.Context, permitID uint, managerID uint) error {
	now := time.Now()
	updaters := map[string]interface{}{
		"ManagerID":     managerID,
		"ManagerApprov": now,
	}
	// Move state directly to wait for K3
	return s.repo.UpdateStatus(ctx, permitID, domain.PermitStatusWaitingK3, updaters)
}

func (s *workPermitService) ApproveByK3(ctx context.Context, permitID uint, k3OfficerID uint) error {
	now := time.Now()
	updaters := map[string]interface{}{
		"K3OfficerID":     k3OfficerID,
		"K3OfficerApprov": now,
	}
	// End state
	return s.repo.UpdateStatus(ctx, permitID, domain.PermitStatusApproved, updaters)
}

func (s *workPermitService) RejectPermit(ctx context.Context, permitID uint) error {
	return s.repo.UpdateStatus(ctx, permitID, domain.PermitStatusRejected, nil)
}
