package models

import (
	"time"
)

type Waybill struct {
	ID                    int64      `json:"id"`
	WaybillNumber         string     `json:"waybill_number"`
	IssueDate             time.Time  `json:"issue_date"`
	DispatchDate          time.Time  `json:"dispatch_date"`
	ExpectedDeliveryDate  *string    `json:"expected_delivery_date"`
	ActualDeliveryDate    *time.Time `json:"actual_delivery_date"`
	Status                *string    `json:"status"`
	SenderID              int64      `json:"sender_id"`
	ReceiverID            int64      `json:"receiver_id"`
	DriverID              int64      `json:"driver_id"`
	VehicleID             int64      `json:"vehicle_id"`
	OriginLocationID      int64      `json:"origin_location_id"`
	DestinationLocationID int64      `json:"destination_location_id"`
	TotalWeight           *float64   `json:"total_weight"`
	TotalPackages         *int64     `json:"total_packages"`
	Desription            *string    `json:"description"`
	FreightCharge         float64    `json:"freight_charge"`
	HaveInsurance         bool       `json:"have_insurance"`
	InsuranceAmount       *float64   `json:"insurance_amount"`
	OtherCharges          *float64   `json:"other_charges"`
	TotalAmount           *float64   `json:"total_amount"`
	PaymentStatus         *string    `json:"payment_status"`
	Notes                 *string    `json:"notes"`
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`
}

type WaybillDetail struct {
	ID                    int64      `json:"id"`
	WaybillNumber         string     `json:"waybill_number"`
	IssueDate             time.Time  `json:"issue_date"`
	DispatchDate          time.Time  `json:"dispatch_date"`
	ExpectedDeliveryDate  *string    `json:"expected_delivery_date"`
	ActualDeliveryDate    *time.Time `json:"actual_delivery_date"`
	Status                *string    `json:"status"`
	Sender                string     `json:"sender"`
	SenderID              int        `json:"sender_id"`
	SenderPhoneMobile     string     `json:"sender_phone_mobile"`
	SenderPhoneFixed      string     `json:"sender_phone_fixed"`
	Receiver              string     `json:"receiver"`
	ReceiverID            int        `json:"receiver_id"`
	ReceiverPhoneMobile   string     `json:"receiver_phone_mobile"`
	ReceiverPhoneFixed    string     `json:"receiver_phone_fixed"`
	Driver                string     `json:"driver"`
	DriverID              int        `json:"driver_id"`
	DriverPhoneNum        string     `json:"driver_phone_num"`
	DriverLicenseNum      string     `json:"driver_license_num"`
	DriverNationalCode    string     `json:"driver_national_code"`
	Vehicle               string     `json:"vehicle"`
	VehicleID             int        `json:"vehicle_id"`
	VehiclePlate          string     `json:"vehicle_plate"`
	OriginLocation        string     `json:"origin_location"`
	OriginLocationID      int        `json:"origin_location_id"`
	DestinationLocation   string     `json:"destination_location"`
	DestinationLocationID int        `json:"destination_location_id"`
	TotalWeight           *float64   `json:"total_weight"`
	TotalPackages         *int64     `json:"total_packages"`
	Desription            *string    `json:"description"`
	FreightCharge         float64    `json:"freight_charge"`
	HaveInsurance         bool       `json:"have_insurance"`
	InsuranceAmount       *float64   `json:"insurance_amount"`
	OtherCharges          *float64   `json:"other_charges"`
	TotalAmount           *float64   `json:"total_amount"`
	PaymentStatus         *string    `json:"payment_status"`
	Notes                 *string    `json:"notes"`
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`
}

type WaybillResponse struct {
	ID                  int64     `json:"id"`
	WaybillNumber       string    `json:"waybill_number"`
	Status              *string   `json:"status"`
	TotalWeight         *float64  `json:"total_weight"`
	HaveInsurance       bool      `json:"have_insurance"`
	TotalAmount         *float64  `json:"total_amount"`
	PaymentStatus       *string   `json:"payment_status"`
	Sender              string    `json:"sender_name"`
	Receiver            string    `json:"receiver_name"`
	Driver              string    `json:"driver_name"`
	OriginLocation      string    `json:"origin_location"`
	DestinationLocation string    `json:"destination_location"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

type CreateWaybillReq struct {
	WaybillNumber         *string    `json:"waybill_number"`
	IssueDate             *time.Time `json:"issue_date"`
	DispatchDate          *time.Time `json:"dispatch_date"`
	ExpectedDeliveryDate  *time.Time `json:"expected_delivery_date"`
	ActualDeliveryDate    *time.Time `json:"actual_delivery_date"`
	Status                *string    `json:"status"`
	SenderID              int64      `json:"sender_id"`
	ReceiverID            int64      `json:"receiver_id"`
	DriverID              int64      `json:"driver_id"`
	VehicleID             int64      `json:"vehicle_id"`
	OriginLocationID      int64      `json:"origin_location_id"`
	DestinationLocationID int64      `json:"destination_location_id"`
	TotalWeight           *float64   `json:"total_weight"`
	TotalPackages         *int64     `json:"total_packages"`
	Desription            *string    `json:"description"`
	FreightCharge         *float64   `json:"freight_charge"`
	HaveInsurance         bool       `json:"have_insurance"`
	InsuranceAmount       float64    `json:"insurance_amount,omitempty"`
	OtherCharges          *float64   `json:"other_charges"`
	PaymentStatus         *string    `json:"payment_status"`
	Notes                 *string    `json:"notes"`
}

type UpdateWaybillReq struct {
	WaybillNumber         *string  `json:"waybill_number"`
	IssueDate             *string  `json:"issue_date"`
	DispatchDate          *string  `json:"dispatch_date"`
	ExpectedDeliveryDate  *string  `json:"expected_delivery_date"`
	ActualDeliveryDate    *string  `json:"actual_delivery_date"`
	Status                *string  `json:"status"`
	SenderID              *int64   `json:"sender_id"`
	ReceiverID            *int64   `json:"receiver_id"`
	DriverID              *int64   `json:"driver_id"`
	VehicleID             *int64   `json:"vehicle_id"`
	OriginLocationID      *int64   `json:"origin_location_id"`
	DestinationLocationID *int64   `json:"destination_location_id"`
	TotalWeight           *float64 `json:"total_weight"`
	TotalPackages         *int64   `json:"total_packages"`
	Desription            *string  `json:"description"`
	FreightCharge         *float64 `json:"freight_charge"`
	HaveInsurance         *bool    `json:"have_insurance"`
	InsuranceAmount       *float64 `json:"insurance_amount"`
	OtherCharges          *float64 `json:"other_charges"`
	TotalAmount           *float64 `json:"total_amount"`
	PaymentStatus         *string  `json:"payment_status"`
	Notes                 *string  `json:"notes"`
}

type WaybillFilters struct {
	Page          int64
	Limit         int64
	CustomerID    string
	WaybillNumber string
	PaymentStatus string
	From          *time.Time
	To            *time.Time
	Amount        string
	Status        string
	Search        string
	SortBy        string
	OrderBy       string
}

// driverID : 1, VehicleID: 1, origin: 1, destination: 2
