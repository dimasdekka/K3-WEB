package domain

import (
	"time"

	"gorm.io/datatypes"
)

// WorkPermitStatus enumeration
const (
	PermitStatusDraft          = "DRAFT"
	PermitStatusWaitingManager = "WAITING_MANAGER"
	PermitStatusWaitingK3      = "WAITING_K3"
	PermitStatusApproved       = "APPROVED"
	PermitStatusRejected       = "REJECTED"
)

// WorkPermit represents Form F.120.21.00.01 Rev.02
type WorkPermit struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	PermitNumber   string         `gorm:"uniqueIndex;not null" json:"permit_number"`
	Date           time.Time      `gorm:"not null" json:"date"`
	Location       string         `json:"location"`
	Area           string         `json:"area"`
	Plant          string         `json:"plant"`
	Subcontractor  string         `json:"subcontractor"`
	SupervisorID   *uint          `json:"supervisor_id"` // Fk directly representing User
	Supervisor     *User          `gorm:"foreignKey:SupervisorID" json:"supervisor,omitempty"`

	// Classifications (Kerja Panas, Ketinggian, dll)
	Classifications datatypes.JSON `json:"classifications"`

	// Related tables for dynamic rows
	Personnel EquipmentsAndPersonnel `gorm:"-" json:"-"` // We map this via relationship but let's keep it strictly normalized
	ListPersonnel   []WorkPermitPersonnel         `gorm:"foreignKey:WorkPermitID" json:"personnel"`
	ListEquipments  []WorkPermitEquipment         `gorm:"foreignKey:WorkPermitID" json:"equipments"`
	ListRisks       []WorkPermitContaminationRisk `gorm:"foreignKey:WorkPermitID" json:"risks"`

	// APD Checklists (Helm, Kacamata, dll)
	ChecklistAPD datatypes.JSON `json:"checklist_apd"`

	// Workflow
	Status        string     `gorm:"default:'DRAFT';not null" json:"status"`
	ManagerID     *uint      `json:"manager_id"`
	ManagerApprov *time.Time `json:"manager_approved_at"`

	K3OfficerID     *uint      `json:"k3_officer_id"`
	K3OfficerApprov *time.Time `json:"k3_officer_approved_at"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type EquipmentsAndPersonnel struct{}

// WorkPermitPersonnel represents persons involved in the permit
type WorkPermitPersonnel struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	WorkPermitID uint   `gorm:"not null;index" json:"work_permit_id"`
	Name         string `gorm:"not null" json:"name"`
	Role         string `json:"role"`
}

// WorkPermitEquipment represents Alat/Mesin/Material
type WorkPermitEquipment struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	WorkPermitID uint   `gorm:"not null;index" json:"work_permit_id"`
	Type         string `gorm:"not null" json:"type"` // e.g. "Mesin", "Alat Berat"
	Name         string `gorm:"not null" json:"name"`
	Quantity     int    `gorm:"not null;default:1" json:"quantity"`
}

// WorkPermitContaminationRisk represents Potensi Kontaminasi
type WorkPermitContaminationRisk struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	WorkPermitID  uint   `gorm:"not null;index" json:"work_permit_id"`
	Activity      string `json:"activity"`
	Hazard        string `json:"hazard"`
	SafetyMeasure string `json:"safety_measure"`
}
