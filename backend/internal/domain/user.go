package domain

import (
	"time"
)

// User represents the users table in the system
// This holds access roles like Admin, Petugas K3, Pengawas Project, etc.
type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	NIK       string    `gorm:"uniqueIndex;not null" json:"nik"`
	Name      string    `gorm:"not null" json:"name"`
	Password  string    `gorm:"not null" json:"-"` // never expose password
	Role      string    `gorm:"not null" json:"role"` // e.g. "Admin K3", "Petugas K3"
	Dept      string    `json:"department"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
