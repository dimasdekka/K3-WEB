package repository

import (
	"context"

	"github.com/fonusa/k3-backend/internal/domain"
	"gorm.io/gorm"
)

type PatrolRepository interface {
	Create(ctx context.Context, p *domain.PatrolK3) error
	GetByID(ctx context.Context, id uint) (*domain.PatrolK3, error)
	ListAll(ctx context.Context) ([]domain.PatrolK3, error)
	UpdateStatus(ctx context.Context, id uint, status string, updaters map[string]interface{}) error
}

type patrolRepository struct {
	db *gorm.DB
}

func NewPatrolRepository(db *gorm.DB) PatrolRepository {
	return &patrolRepository{db: db}
}

func (r *patrolRepository) Create(ctx context.Context, p *domain.PatrolK3) error {
	return r.db.WithContext(ctx).Create(p).Error
}

func (r *patrolRepository) GetByID(ctx context.Context, id uint) (*domain.PatrolK3, error) {
	var p domain.PatrolK3
	err := r.db.WithContext(ctx).First(&p, id).Error
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *patrolRepository) ListAll(ctx context.Context) ([]domain.PatrolK3, error) {
	var patrols []domain.PatrolK3
	err := r.db.WithContext(ctx).
		Order("created_at desc").
		Find(&patrols).Error
	return patrols, err
}

func (r *patrolRepository) UpdateStatus(ctx context.Context, id uint, status string, updaters map[string]interface{}) error {
	updates := map[string]interface{}{
		"status": status,
	}
	for k, v := range updaters {
		updates[k] = v
	}

	return r.db.WithContext(ctx).Model(&domain.PatrolK3{}).Where("id = ?", id).Updates(updates).Error
}
