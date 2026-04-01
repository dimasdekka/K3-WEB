package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/fonusa/k3-backend/internal/domain"
	"github.com/fonusa/k3-backend/internal/repository"
)

type PatrolService interface {
	CreatePatrol(ctx context.Context, patrol *domain.PatrolK3) error
	GetPatrol(ctx context.Context, id uint) (*domain.PatrolK3, error)
	ListPatrols(ctx context.Context) ([]domain.PatrolK3, error)
	ApproveByPIC(ctx context.Context, patrolID uint, picID uint) error
}

type patrolService struct {
	repo repository.PatrolRepository
}

func NewPatrolService(repo repository.PatrolRepository) PatrolService {
	return &patrolService{repo: repo}
}

// categoryItem represents the expected shape inside the JSON payload for any category array
type categoryItem struct {
	Item  string `json:"item"`
	Score string `json:"score"` // "N.A", "OK", "Minor", "Major", "Kritikal"
	Note  string `json:"note"`
}

func (s *patrolService) CreatePatrol(ctx context.Context, patrol *domain.PatrolK3) error {
	patrol.PatrolNumber = fmt.Sprintf("PATROL-%d", time.Now().UnixNano())
	patrol.Status = domain.PatrolStatusWaitingPIC

	// Automated Scoring Evaluator
	var categoriesMap map[string][]categoryItem
	if err := json.Unmarshal(patrol.PatrolCategories, &categoriesMap); err != nil {
		return fmt.Errorf("failed to parse patrol categories JSON for scoring: %v", err)
	}

	totalPoints := 0
	validItemsCount := 0
	hasCritical := false

	for _, items := range categoriesMap {
		for _, item := range items {
			if item.Score == "N.A" || item.Score == "" {
				continue // Do not count towards average division
			}
			validItemsCount++

			switch item.Score {
			case "OK":
				totalPoints += 100
			case "Minor":
				totalPoints += 80
			case "Major":
				totalPoints += 40
				hasCritical = true // Major flags the dashboard
			case "Kritikal":
				totalPoints += 0
				hasCritical = true // Kritikal intensely flags the dashboard
			}
		}
	}

	if validItemsCount > 0 {
		patrol.TotalScore = totalPoints / validItemsCount
	} else {
		patrol.TotalScore = 100 // Default if everything was strictly N.A
	}
	
	patrol.HasCritical = hasCritical

	return s.repo.Create(ctx, patrol)
}

func (s *patrolService) GetPatrol(ctx context.Context, id uint) (*domain.PatrolK3, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *patrolService) ListPatrols(ctx context.Context) ([]domain.PatrolK3, error) {
	return s.repo.ListAll(ctx)
}

func (s *patrolService) ApproveByPIC(ctx context.Context, patrolID uint, picID uint) error {
	now := time.Now()
	updaters := map[string]interface{}{
		"PIC_ID":          picID,
		"PICApprovedAt": now,
	}
	return s.repo.UpdateStatus(ctx, patrolID, domain.PatrolStatusApprovedPIC, updaters)
}
