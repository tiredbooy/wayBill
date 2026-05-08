package models

import (
	"time"
)

type Vehicle struct {
	ID              int64                `json:"id"`
	Plate           string               `json:"plate"`
	Model           string               `json:"model"`
	Year            string               `json:"year"`
	Capacity        string               `json:"capacity"`
	Color           string               `json:"color"`
	Status          string               `json:"status"`
	InsuranceExpiry *string `json:"insurance_expiry"`
	Notes           string               `json:"notes"`
	CreatedAt       time.Time            `json:"created_at"`
	UpdatedAt       time.Time            `json:"updated_at"`
}

type UpdateVehicleReq struct {
	Plate           *string               `json:"plate"`
	Model           *string               `json:"model"`
	Year            *string               `json:"year"`
	Capacity        *string               `json:"capacity"`
	Color           *string               `json:"color"`
	Status          *string               `json:"status"`
	InsuranceExpiry *string `json:"insurance_expiry"`
	Notes           *string               `json:"notes"`
}

type VehiclesResponse struct {
	ID              int64      `json:"id"`
	Plate           string     `json:"plate"`
	Model           string     `json:"model"`
	DriverName      *string `json:"driver"`
	Year            string     `json:"year"`
	Capacity        string     `json:"capacity"`
	Color           string     `json:"color"`
	Status          string     `json:"status"`
	InsuranceExpiry *time.Time `json:"insurance_expiry"`
	Notes           string     `json:"notes"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

type VehicleFilters struct {
	Page    int64
	Limit   int64
	Search  string
	Status  string
	SortBy  string
	OrderBy string
}
