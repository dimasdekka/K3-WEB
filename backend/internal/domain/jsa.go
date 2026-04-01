package domain

import (
	"time"

	"gorm.io/datatypes"
)

// JSAStatus enumeration representing scalable workflow
const (
	JSAStatusDraft          = "DRAFT"
	JSAStatusWaitingManager = "WAITING_MANAGER" // Future-proof scalable step
	JSAStatusWaitingK3      = "WAITING_K3"
	JSAStatusApproved       = "APPROVED_K3"
	JSAStatusRejected       = "REJECTED"
)

// JSA represents Form F.120.01.00.11 Rev.01
type JSA struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	JobNumber    string    `gorm:"uniqueIndex;not null" json:"job_number"`
	JobName      string    `gorm:"not null" json:"job_name"`
	Date         time.Time `gorm:"not null" json:"date"`
	Supervisor   string    `json:"supervisor"`
	Department   string    `json:"department"`
	Executor     string    `json:"executor"`
	WorkPermitID *uint     `json:"work_permit_id"` // Optional link to Ijin Kerja

	// APD (Helm, Kacamata, dll)
	RequiredAPD datatypes.JSON `json:"required_apd"`

	// Sumber Bahaya Umum (Mesin, Peralatan, dll)
	HazardSources datatypes.JSON `json:"hazard_sources"`

	// Analysis Steps (Tabel Analisis Dinamis)
	AnalysisSteps []JSAAnalysisStep `gorm:"foreignKey:JSAID" json:"analysis_steps"`

	// Workflow
	Status        string     `gorm:"default:'WAITING_K3';not null" json:"status"`
	
	// Scalable Approvers
	ManagerID     *uint      `json:"manager_id"`
	ManagerApprov *time.Time `json:"manager_approved_at"`

	K3OfficerID     *uint      `json:"k3_officer_id"`
	K3OfficerApprov *time.Time `json:"k3_officer_approved_at"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// JSAAnalysisStep represents a single dynamic row in the safety analysis process
type JSAAnalysisStep struct {
	ID             uint   `gorm:"primaryKey" json:"id"`
	JSAID          uint   `gorm:"not null;index" json:"jsa_id"`
	Sequence       int    `gorm:"not null" json:"sequence"` // Order 1, 2, 3...
	WorkStep       string `gorm:"not null" json:"work_step"` // Urutan pekerjaan
	HazardSource   string `json:"hazard_source"`             // Sumber bahaya spesifik langkah
	PotentialHazard string `json:"potential_hazard"`         // Potensi Bahaya
	ControlMeasure string `json:"control_measure"`           // Upaya Pengendalian
}
