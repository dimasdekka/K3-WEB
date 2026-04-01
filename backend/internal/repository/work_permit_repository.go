package repository

import (
	"context"

	"github.com/fonusa/k3-backend/internal/domain"
	"gorm.io/gorm"
)

type WorkPermitRepository interface {
	Create(ctx context.Context, permit *domain.WorkPermit) error
	GetByID(ctx context.Context, id uint) (*domain.WorkPermit, error)
	UpdateStatus(ctx context.Context, id uint, status string, updaters map[string]interface{}) error
	ListAll(ctx context.Context) ([]domain.WorkPermit, error)
}

type workPermitRepository struct {
	db *gorm.DB
}

func NewWorkPermitRepository(db *gorm.DB) WorkPermitRepository {
	return &workPermitRepository{db: db}
}

func (r *workPermitRepository) Create(ctx context.Context, permit *domain.WorkPermit) error {
	return r.db.WithContext(ctx).Create(permit).Error
}

func (r *workPermitRepository) GetByID(ctx context.Context, id uint) (*domain.WorkPermit, error) {
	var permit domain.WorkPermit
	err := r.db.WithContext(ctx).
		Preload("Supervisor").
		Preload("ListPersonnel").
		Preload("ListEquipments").
		Preload("ListRisks").
		First(&permit, id).Error
	if err != nil {
		return nil, err
	}
	return &permit, nil
}

func (r *workPermitRepository) UpdateStatus(ctx context.Context, id uint, status string, updaters map[string]interface{}) error {
	updates := map[string]interface{}{
		"status": status,
	}
	for k, v := range updaters {
		updates[k] = v
	}

	return r.db.WithContext(ctx).Model(&domain.WorkPermit{}).Where("id = ?", id).Updates(updates).Error
}

func (r *workPermitRepository) ListAll(ctx context.Context) ([]domain.WorkPermit, error) {
	var permits []domain.WorkPermit
	err := r.db.WithContext(ctx).
		Preload("Supervisor").
		Order("created_at desc").
		Find(&permits).Error
	return permits, err
}
