package repository

import (
	"context"

	"github.com/fonusa/k3-backend/internal/domain"
	"gorm.io/gorm"
)

type JSARepository interface {
	Create(ctx context.Context, jsa *domain.JSA) error
	GetByID(ctx context.Context, id uint) (*domain.JSA, error)
	ListAll(ctx context.Context) ([]domain.JSA, error)
	UpdateStatus(ctx context.Context, id uint, status string, updaters map[string]interface{}) error
}

type jsaRepository struct {
	db *gorm.DB
}

func NewJSARepository(db *gorm.DB) JSARepository {
	return &jsaRepository{db: db}
}

func (r *jsaRepository) Create(ctx context.Context, jsa *domain.JSA) error {
	// Gorm will automatically save the nested AnalysisSteps due to the HasMany relation
	return r.db.WithContext(ctx).Create(jsa).Error
}

func (r *jsaRepository) GetByID(ctx context.Context, id uint) (*domain.JSA, error) {
	var jsa domain.JSA
	err := r.db.WithContext(ctx).
		Preload("AnalysisSteps", func(db *gorm.DB) *gorm.DB {
			return db.Order("sequence ASC")
		}).
		First(&jsa, id).Error
	if err != nil {
		return nil, err
	}
	return &jsa, nil
}

func (r *jsaRepository) ListAll(ctx context.Context) ([]domain.JSA, error) {
	var jsas []domain.JSA
	err := r.db.WithContext(ctx).
		Order("created_at desc").
		Find(&jsas).Error
	return jsas, err
}

func (r *jsaRepository) UpdateStatus(ctx context.Context, id uint, status string, updaters map[string]interface{}) error {
	updates := map[string]interface{}{
		"status": status,
	}
	for k, v := range updaters {
		updates[k] = v
	}

	return r.db.WithContext(ctx).Model(&domain.JSA{}).Where("id = ?", id).Updates(updates).Error
}
