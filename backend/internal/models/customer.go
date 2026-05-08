package models

import (
	"time"
)

type Customer struct {
	ID           int64                 `json:"id"`
	Name         string                `json:"name"`
	NationalID   string                `json:"national_id"`
	EconomicCode string                `json:"economic_code"`
	PhoneMobile  *string `json:"phone_mobile"`
	PhoneFixed   *string `json:"phone_fixed"`
	Address      string                `json:"address"`
	PostalCode   *string `json:"postal_code"`
	City         *string `json:"city"`
	Province     *string `json:"province"` // استان
	Email        *string `json:"email"`
	Notes        string                `json:"notes"`
	CreatedAt    time.Time             `json:"created_at"`
	UpdatedAt    time.Time             `json:"updated_at"`
}

type CreateCustomerReq struct {
	Name         string  `json:"name"`
	NationalID   string  `json:"national_id"`
	EconomicCode string  `json:"economic_code"`
	PhoneMobile  *string `json:"phone_mobile"`
	PhoneFixed   *string `json:"phone_fixed"`
	Address      *string `json:"address"`
	PostalCode   *string `json:"postal_code"`
	City         *string `json:"city"`
	Province     *string `json:"province"` // استان
	Email        string  `json:"email"`
	Notes        string  `json:"notes"`
}

type UpdateCustomerReq struct {
	Name         *string `json:"name"`
	NationalID   *string `json:"national_id"`
	EconomicCode *string `json:"economic_code"`
	PhoneMobile  *string `json:"phone_mobile"`
	PhoneFixed   *string `json:"phone_fixed"`
	Address      *string `json:"address"`
	PostalCode   *string `json:"postal_code"`
	City         *string `json:"city"`
	Province     *string `json:"province"` // استان
	Email        *string `json:"email"`
	Notes        *string `json:"notes"`
}

type CustomerFilters struct {
	Page    int64
	Limit   int64
	Search  string
	SortBy  string
	OrderBy string
}
