package domain

import (
	"time"

	"gorm.io/datatypes"
)

const (
	PatrolStatusWaitingPIC  = "WAITING_PIC"
	PatrolStatusApprovedPIC = "APPROVED_PIC"
)

// PatrolK3 maps the sweeping 15-category safety checklist
type PatrolK3 struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	PatrolNumber  string         `gorm:"uniqueIndex;not null" json:"patrol_number"`
	Date          time.Time      `gorm:"not null" json:"date"`
	Area          string         `gorm:"not null" json:"area"`
	PatrolOfficer string         `gorm:"not null" json:"patrol_officer"`

	// JSON payload mapping to { "Pengaman Mesin": [{item: "A", score: "OK", node: ""}], ... }
	PatrolCategories datatypes.JSON `json:"patrol_categories"`

	// Automated Scoring Engine Results
	TotalScore  int  `json:"total_score"`
	HasCritical bool `json:"has_critical"`

	// Workflow State
	Status        string     `gorm:"default:'WAITING_PIC';not null" json:"status"`
	PIC_ID        *uint      `json:"pic_id"`
	PICApprovedAt *time.Time `json:"pic_approved_at"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
