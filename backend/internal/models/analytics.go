package models

import "time"

type AnalyticsSummary struct {
	// Counts
	TotalWaybills     int `json:"total_waybills"`
	ActiveWaybills    int `json:"active_waybills"`
	DeliveredWaybills int `json:"delivered_waybills"`

	// Financials
	TotalFreight      float64 `json:"total_freight"`
	TotalOtherCharges float64 `json:"total_other_charges"`
	TotalInsurance    float64 `json:"total_insurance"`
	TotalAmount       float64 `json:"total_amount"`
	AverageFreight    float64 `json:"average_freight"`

	// Revenue (commission) – filled by the service
	CommissionRate float64 `json:"commission_rate"`
	Revenue        float64 `json:"revenue"`

	TopSenders   []CustomerStat `json:"top_senders"`
	TopReceivers []CustomerStat `json:"top_receivers"`
}

type CustomerStat struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type AnalyticFilters struct {
	Period    string    `json:"period"`
	StartDate time.Time `json:"start_date,omitempty"`
	EndDate   time.Time `json:"end_date,omitempty"`
}
