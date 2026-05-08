package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

type Setting struct {
	ID             uint        `json:"id"`
	CompanyName    *string      `json:"company_name"`
	Address        *string      `json:"address"`
	Contact        *ContactInfo `json:"contact"`
	CommissionRate *float64     `json:"commission_rate"`
	PreferredTheme *string      `json:"preferred_theme"`
	UpdatedAt      time.Time   `json:"updated_at"`
}

// ContactInfo groups all contact fields (we store mobile as JSON array)
type ContactInfo struct {
	Mobiles  []string `json:"mobiles"`
	Fixed   string   `json:"fixed"`
	Email   string   `json:"email"`
	Website string   `json:"website"`
}

// SettingReq is used for create/update operations (ID and UpdatedAt are auto‑managed)
type SettingReq struct {
	CompanyName    *string      `json:"company_name"`
	Address        *string      `json:"address"`
	Contact        *ContactInfo `json:"contact"`
	CommissionRate *float64     `json:"commission_rate"`
	PreferredTheme *string      `json:"preferred_theme"`
}

// Value implements driver.Valuer for ContactInfo (to store JSON in MySQL)
func (c ContactInfo) Value() (driver.Value, error) {
	return json.Marshal(c)
}

// Scan implements sql.Scanner for ContactInfo (to read JSON from MySQL)
func (c *ContactInfo) Scan(value interface{}) error {
	if value == nil {
		*c = ContactInfo{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("failed to scan ContactInfo: expected []byte, got %T", value)
	}
	return json.Unmarshal(bytes, c)
}
