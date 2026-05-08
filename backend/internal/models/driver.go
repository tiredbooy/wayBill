package models

import (
	"time"
)

type Driver struct {
	ID            int64                 `json:"id"`
	FirstName     string                `json:"first_name"`
	LastName      string                `json:"last_name"`
	Phone         *string               `json:"phone"`
	VehicleID     int64                 `json:"vehicle_id"`
	Code          string                `json:"code"`
	Address       *string               `json:"address"`
	NationalCode  string                `json:"national_code"`
	Email         *string               `json:"email"`
	LicenseNumber *string `json:"license_number"`
	LicenseExpiry *time.Time            `json:"license_expiry"`
	HireDate      *string `json:"hire_date"`
	BirthDate     *time.Time            `json:"birth_date"`
	Status        string                `json:"status"`
	UpdatedAt     time.Time             `json:"updated_at"`
	CreatedAt     time.Time             `json:"created_at"`
}

type DriverDetails struct {
	ID            int64                 `json:"id"`
	FirstName     string                `json:"first_name"`
	LastName      string                `json:"last_name"`
	Phone         *string               `json:"phone"`
	VehicleID     *int64                 `json:"vehicle_id"`
	VehicleModel  *string               `json:"vehicle_model"`
	VehiclePlate  *string               `json:"vehicle_plate"`
	Code          string                `json:"code"`
	Address       *string               `json:"address"`
	NationalCode  string                `json:"national_code"`
	Email         *string               `json:"email"`
	LicenseNumber *string `json:"license_number"`
	LicenseExpiry *time.Time            `json:"license_expiry"`
	HireDate      *string `json:"hire_date"`
	BirthDate     *time.Time            `json:"birth_date"`
	Status        string                `json:"status"`
	UpdatedAt     time.Time             `json:"updated_at"`
	CreatedAt     time.Time             `json:"created_at"`
}

type UpdateDriverReq struct {
	FirstName     *string               `json:"first_name"`
	LastName      *string               `json:"last_name"`
	Phone         *string               `json:"phone"`
	VehicleID     *int64                `json:"vehicle_id"`
	Code          *string               `json:"code"`
	Address       *string               `json:"address"`
	NationalCode  *string               `json:"national_code"`
	Email         *string               `json:"email"`
	LicenseNumber *string               `json:"license_number"`
	LicenseExpiry *string `json:"license_expiry"`
	HireDate      *string `json:"hire_date"`
	BirthDate     *string `json:"birth_date"`
	Status        *string               `json:"status"`
}

type CreateDriverReq struct {
	FirstName     string                `json:"first_name"`
	LastName      string                `json:"last_name"`
	Phone         *string `json:"phone"`
	VehicleID     int64                 `json:"vehicle_id"`
	Code          string                `json:"code"`
	Address       *string               `json:"address"`
	NationalCode  *string               `json:"national_code"`
	Email         *string               `json:"email"`
	LicenseNumber *string               `json:"license_number"`
	LicenseExpiry *string `json:"license_expiry"`
	HireDate      *string `json:"hire_date"`
	BirthDate     *string `json:"birth_date"`
	Status        string                `json:"status"`
}

type DriverResponse struct {
	ID            int64                 `json:"id"`
	FirstName     string                `json:"first_name"`
	LastName      string                `json:"last_name"`
	VehicleID     *int64                 `json:"vehicle_id"`
	TotalWaybills int64                 `json:"total_waybills"`
	NationalCode  string                `json:"national_code"`
	Phone         *string `json:"phone"`
	Code          string                `json:"code"`
	Email         *string `json:"email"`
	Status        string                `json:"status"`
	LicenseExpiry *time.Time            `json:"license_expiry"`
	HireDate      *string `json:"hire_date"`
	CreatedAt     *time.Time            `json:"created_at"`
}

type DriverFilters struct {
	Page    int64
	Limit   int64
	Search  string
	Status  string
	SortBy  string
	OrderBy string
}
