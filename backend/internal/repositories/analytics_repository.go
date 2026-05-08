package repositories

import (
	"context"
	"database/sql"
	"time"
	"waybill/backend/internal/models"
)

type AnalyticsRepository struct {
	db *sql.DB
}

func NewAnalyticsRepository(db *sql.DB) *AnalyticsRepository {
	return &AnalyticsRepository{db: db}
}

func (r *AnalyticsRepository) GetAnalyticsSummary(ctx context.Context, startDate, endDate time.Time) (models.AnalyticsSummary, error) {
	var a models.AnalyticsSummary

	query := `
        SELECT
            COUNT(*) AS total_waybills,
            COALESCE(SUM(total_amount), 0) AS total_amount,
            COALESCE(SUM(freight_charge), 0) AS total_freight,
            COALESCE(SUM(other_charges), 0) AS total_other_charges,
            COALESCE(SUM(insurance_amount), 0) AS total_insurance,
            COALESCE(SUM(CASE WHEN status IN ('in_transit', 'pending') THEN 1 ELSE 0 END), 0) AS active_waybills,
            COALESCE(SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END), 0) AS delivered_waybills
        FROM waybill
        WHERE 1=1
    `

	var args []any

	if !startDate.IsZero() {
		query += " AND issue_date >= ?"
		args = append(args, startDate)
	}
	if !endDate.IsZero() {
		query += " AND issue_date <= ?"
		args = append(args, endDate)
	}

	err := r.db.QueryRowContext(ctx, query, args...).Scan(
		&a.TotalWaybills,
		&a.TotalAmount,
		&a.TotalFreight,
		&a.TotalOtherCharges,
		&a.TotalInsurance,
		&a.ActiveWaybills,
		&a.DeliveredWaybills,
	)
	if err != nil {
		return a, err
	}

	// Compute average freight (avoid division by zero)
	if a.TotalWaybills > 0 {
		a.AverageFreight = a.TotalFreight / float64(a.TotalWaybills)
	}

	return a, nil
}

func (r *AnalyticsRepository) GetTopSenders(ctx context.Context, startDate, endDate time.Time, limit int) ([]models.CustomerStat, error) {
	query := `
        SELECT c.name, COUNT(*) as cnt
        FROM waybill w
        JOIN customer c ON w.sender_id = c.id
        WHERE 1=1
    `
	var args []any

	if !startDate.IsZero() {
		query += " AND w.issue_date >= ?"
		args = append(args, startDate)
	}
	if !endDate.IsZero() {
		query += " AND w.issue_date <= ?"
		args = append(args, endDate)
	}

	query += " GROUP BY w.sender_id ORDER BY cnt DESC LIMIT ?"
	args = append(args, limit)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Always return an empty slice, not nil, for predictable JSON output
	senders := make([]models.CustomerStat, 0)
	for rows.Next() {
		var cs models.CustomerStat
		if err := rows.Scan(&cs.Name, &cs.Count); err != nil {
			return nil, err
		}
		senders = append(senders, cs)
	}
	return senders, rows.Err()
}
