package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
)

type WaybillRepository interface {
	Create(ctx context.Context, req models.CreateWaybillReq) error
	GetAllWaybills(ctx context.Context, q models.WaybillFilters) (models.Page[models.WaybillResponse], error)
	GetWaybillByID(ctx context.Context, waybillID int64) (models.WaybillDetail, error)
	Update(ctx context.Context, waybillID int64, req models.UpdateWaybillReq) error
	Delete(ctx context.Context, waybillID int64) error
}

type waybillRepository struct {
	db *sql.DB
}

func NewWaybillRepository(db *sql.DB) WaybillRepository {
	return &waybillRepository{db: db}
}

func (r *waybillRepository) Create(ctx context.Context, req models.CreateWaybillReq) error {
	tx, err := r.db.Begin()
	if err != nil {
		return apperr.New(apperr.Internal, "Failed to begin Transaction.")
	}
	defer tx.Rollback()

	query := `
    INSERT INTO waybill
        (waybill_number, issue_date, dispatch_date, expected_delivery_date, actual_delivery_date,
         status, sender_id, receiver_id, driver_id, vehicle_id,
         origin_location_id, destination_location_id, total_weight, total_packages,
         description, freight_charge, insurance_amount, other_charges,
         total_amount, payment_status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

	freightCharge := 0.0
	if req.FreightCharge != nil {
		freightCharge = *req.FreightCharge
	}
	otherCharges := 0.0
	if req.OtherCharges != nil {
		otherCharges = *req.OtherCharges
	}
	totalAmount := freightCharge + otherCharges
	if req.HaveInsurance {
		insuranceAmount := 0.0
		if req.InsuranceAmount != 0 {
			insuranceAmount = req.InsuranceAmount
		}
		totalAmount += insuranceAmount
	}

	result, err := tx.ExecContext(ctx, query,
		req.WaybillNumber, req.IssueDate, req.DispatchDate, req.ExpectedDeliveryDate,
		req.ActualDeliveryDate, req.Status, req.SenderID, req.ReceiverID,
		req.DriverID, req.VehicleID, req.OriginLocationID, req.DestinationLocationID,
		req.TotalWeight, req.TotalPackages, req.Desription, req.FreightCharge,
		req.InsuranceAmount, req.OtherCharges,
		totalAmount,
		req.PaymentStatus, req.Notes,
	)
	if err != nil {
		return err
	}

	waybillID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	paymentQuery := `INSERT INTO payment (waybill_id, amount, paid_at) VALUES (?, ?, ?)`
	_, err = tx.Exec(paymentQuery, waybillID, totalAmount, time.Now())
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (r *waybillRepository) GetAllWaybills(ctx context.Context, q models.WaybillFilters) (models.Page[models.WaybillResponse], error) {
	offset := (q.Page - 1) * q.Limit

	where := "WHERE 1=1"
	args := []any{}

	if q.CustomerID != "" {
		where += " AND sender_id = ? OR receiver_id = ?"
		s := "%" + q.CustomerID + "%"
		args = append(args, s, s)
	}

	if q.WaybillNumber != "" {
		where += " AND waybill_number = ?"
		args = append(args, q.WaybillNumber)
	}

	if q.From != nil {
		where += " AND created_at >= ?"
		args = append(args, q.From)
	}

	if q.To != nil {
		where += " AND created_at <= ?"
		args = append(args, q.To)
	}

	if q.WaybillNumber != "" {
		where += " AND waybill_number = ?"
		args = append(args, q.WaybillNumber)
	}

	if q.Amount != "" {
		where += " AND total_amount >= ?"
		args = append(args, q.Amount)
	}

	if q.Search != "" {
		where += " AND (id LIKE ? OR description LIKE ?)"
		s := "%" + q.Search + "%"
		args = append(args, s, s)
	}

	if q.PaymentStatus != "" {
		where += " AND payment_status = ?"
		args = append(args, q.PaymentStatus)
	}

	if q.Status != "" {
		where += "AND status = ?"
		args = append(args, q.Status)
	}

	var total int64
	countSql := "SELECT COUNT(*) FROM waybill"
	if err := r.db.QueryRowContext(ctx, countSql, args...).Scan(&total); err != nil {
		return models.Page[models.WaybillResponse]{}, err
	}

	orderBy := "ORDER BY w.id"
	switch q.SortBy {
	case "waybillNum":
		orderBy = "ORDER BY w.waybill_number"
	case "sender":
		orderBy = "ORDER BY w.sender_id"
	case "receiver":
		orderBy = "ORDER BY w.receiver_id"
	case "status":
		orderBy = "ORDER BY w.status"
	case "date":
		orderBy = "ORDER BY w.created_at"
	}

	if q.OrderBy == "asc" {
		orderBy += " ASC"
	} else {
		orderBy += " DESC"
	}

	dataSql := `
		SELECT w.id, w.waybill_number, w.status, w.total_weight, w.have_insurance,
			w.total_amount, w.payment_status, w.created_at, c1.name AS sender,
			c2.name AS receiver, l1.name AS origin_location, l2.name AS destination_location, d.first_name || d.last_name AS driver
			FROM waybill w
			LEFT JOIN customer c1 ON w.sender_id = c1.id
			LEFT JOIN customer c2 ON w.receiver_id = c2.id
			LEFT JOIN location l1 ON w.origin_location_id = l1.id
			LEFT JOIN location l2 ON w.destination_location_id = l2.id
			LEFT JOIN driver d ON w.driver_id = d.id 
	` + " " + where + " " + orderBy + " LIMIT ? OFFSET ?"

	rows, err := r.db.QueryContext(ctx, dataSql, append(args, q.Limit, offset)...)
	if err != nil {
		return models.Page[models.WaybillResponse]{}, err
	}

	defer rows.Close()

	results := make([]models.WaybillResponse, 0, q.Limit)
	for rows.Next() {
		var r models.WaybillResponse
		if err := rows.Scan(
			&r.ID, &r.WaybillNumber, &r.Status, &r.TotalWeight, &r.HaveInsurance, &r.TotalAmount,
			&r.PaymentStatus, &r.CreatedAt, &r.Sender, &r.Receiver, &r.OriginLocation, &r.DestinationLocation, &r.Driver); err != nil {
			return models.Page[models.WaybillResponse]{}, err
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return models.Page[models.WaybillResponse]{}, err
	}

	totalPages := (total + q.Limit - 1) / q.Limit
	return models.Page[models.WaybillResponse]{
		Pagination: models.Pagination{
			TotalItems: total,
			TotalPage:  totalPages,
			HasNext:    q.Page < totalPages,
			HasPrev:    q.Page > 1,
		},
		Results: results,
	}, nil
}

func (r *waybillRepository) GetWaybillByID(ctx context.Context, waybillID int64) (models.WaybillDetail, error) {
	var res models.WaybillDetail

	query := `
		SELECT w.id, w.waybill_number, w.issue_date, w.dispatch_date, w.expected_delivery_date,
		 w.actual_delivery_date, w.status, w.sender_id, c1.name AS sender, c1.phone_mobile, c1.phone_fixed,
			w.receiver_id, c2.name AS receiver, c2.phone_mobile, c2.phone_fixed, w.driver_id, d.first_name || ' ' || d.last_name AS driver,
			d.phone AS driver_phone_num, d.license_number AS driver_license_num,
			d.national_code AS driver_national_code, w.vehicle_id, v.model as vehicle,
			v.plate AS vehicle_plate, w.origin_location_id, l1.name AS origin_location,
			w.destination_location_id, l2.name AS destination_location, w.total_weight,
			w.total_packages, w.description, w.freight_charge, w.have_insurance,
			w.insurance_amount, w.other_charges, w.total_amount,
			w.payment_status, w.notes,
			w.updated_at, w.created_at
			FROM waybill w
			LEFT JOIN customer c1 ON w.sender_id = c1.id
			LEFT JOIN customer c2 ON w.receiver_id = c2.id
			LEFT JOIN driver d ON w.driver_id = d.id
			LEFT JOIN vehicle v ON w.vehicle_id = v.id
			LEFT JOIN location l1 ON w.origin_location_id = l1.id
			LEFT JOIN location l2 ON w.destination_location_id = l2.id
			WHERE w.id = ?	
	`

	err := r.db.QueryRowContext(ctx, query, waybillID).Scan(
		&res.ID,
		&res.WaybillNumber, &res.IssueDate, &res.DispatchDate, &res.ExpectedDeliveryDate, &res.ActualDeliveryDate,
		&res.Status, &res.SenderID, &res.Sender, &res.SenderPhoneMobile, &res.SenderPhoneFixed, &res.ReceiverID,
		&res.Receiver, &res.ReceiverPhoneMobile, &res.VehicleID, &res.Vehicle, &res.VehiclePlate,
		&res.ReceiverPhoneFixed, &res.DriverID, &res.Driver, &res.DriverPhoneNum, &res.DriverLicenseNum, &res.DriverNationalCode,
		&res.OriginLocationID, &res.OriginLocation, &res.DestinationLocationID, &res.DestinationLocation, &res.TotalWeight, &res.TotalPackages,
		&res.Desription, &res.FreightCharge, &res.HaveInsurance, &res.InsuranceAmount, &res.OtherCharges, &res.TotalAmount,
		&res.PaymentStatus, &res.Notes, &res.UpdatedAt, &res.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return models.WaybillDetail{}, err
	}
	if err != nil {
		return models.WaybillDetail{}, err
	}

	return res, nil
}

func (r *waybillRepository) Update(ctx context.Context, waybillID int64, req models.UpdateWaybillReq) error {
	tx, err := r.db.Begin()

	if err != nil {
		return apperr.New(apperr.Internal, "Failed to begin transaction")
	}
	defer tx.Rollback()

	var updates []string
	args := []interface{}{}
	argPos := 1

	if req.WaybillNumber != nil {
		updates = append(updates, "waybill_number = ?")
		args = append(args, *req.WaybillNumber)
		argPos++
	}

	if req.IssueDate != nil {
		updates = append(updates, "issue_date = ?")
		args = append(args, *req.IssueDate)
		argPos++
	}

	if req.DispatchDate != nil {
		updates = append(updates, "dispatch_date = ?")
		args = append(args, *req.DispatchDate)
		argPos++
	}

	if req.ExpectedDeliveryDate != nil {
		updates = append(updates, "expected_delivery_date = ?")
		args = append(args, *req.ExpectedDeliveryDate)
		argPos++
	}

	if req.ActualDeliveryDate != nil {
		updates = append(updates, "actual_delivery_date = ?")
		args = append(args, *req.ActualDeliveryDate)
		argPos++
	}

	if req.Status != nil {
		updates = append(updates, "status = ?")
		args = append(args, *req.Status)
		argPos++
	}

	if req.SenderID != nil {
		updates = append(updates, "sender_id = ?")
		args = append(args, *req.SenderID)
		argPos++
	}

	if req.ReceiverID != nil {
		updates = append(updates, "receiver_id = ?")
		args = append(args, *req.ReceiverID)
		argPos++
	}

	if req.DriverID != nil {
		updates = append(updates, "driver_id = ?")
		args = append(args, *req.DriverID)
		argPos++
	}

	if req.VehicleID != nil {
		updates = append(updates, "vehicle_id = ?")
		args = append(args, *req.VehicleID)
		argPos++
	}

	if req.OriginLocationID != nil {
		updates = append(updates, "origin_location_id = ?")
		args = append(args, *req.OriginLocationID)
		argPos++
	}

	if req.DestinationLocationID != nil {
		updates = append(updates, "destination_location_id = ?")
		args = append(args, *req.DestinationLocationID)
		argPos++
	}

	if req.TotalWeight != nil {
		updates = append(updates, "total_weight = ?")
		args = append(args, *req.TotalWeight)
		argPos++
	}

	if req.TotalPackages != nil {
		updates = append(updates, "total_packages = ?")
		args = append(args, *req.TotalPackages)
		argPos++
	}

	if req.Desription != nil {
		updates = append(updates, "description = ?")
		args = append(args, *req.Desription)
		argPos++
	}

	if req.FreightCharge != nil {
		updates = append(updates, "freight_charge = ?")
		args = append(args, *req.FreightCharge)
		argPos++
	}

	if req.HaveInsurance != nil {
		updates = append(updates, "have_insurance = ?")
		args = append(args, *req.HaveInsurance)
		argPos++
		if !*req.HaveInsurance && req.InsuranceAmount == nil {
			updates = append(updates, "insurance_amount = ?")
			args = append(args, 0)
			argPos++
		}
	}

	if req.InsuranceAmount != nil {
		updates = append(updates, "insurance_amount = ?")
		args = append(args, *req.InsuranceAmount)
		argPos++
	}

	if req.OtherCharges != nil {
		updates = append(updates, "other_charges = ?")
		args = append(args, *req.OtherCharges)
		argPos++
	}

	if req.PaymentStatus != nil {
		updates = append(updates, "payment_status = ?")
		args = append(args, *req.PaymentStatus)
		argPos++
	}

	if len(updates) > 0 {
		query := fmt.Sprintf("UPDATE waybill SET %s WHERE id = ?", strings.Join(updates, ", "))
		args = append(args, waybillID)

		_, err := tx.ExecContext(ctx, query, args...)
		if err != nil {
			return apperr.New(apperr.Invalid, "خطا: برای ویرایش بارنامه فیلد های مورد نیاز را پرکنید.")
		}
	}

	if _, err := tx.ExecContext(ctx, `
		UPDATE waybill
		SET total_amount = COALESCE(freight_charge, 0)
			+ CASE WHEN have_insurance THEN COALESCE(insurance_amount, 0) ELSE 0 END
			+ COALESCE(other_charges, 0)
		WHERE id = ?
	`, waybillID); err != nil {
		return apperr.Wrap(apperr.Internal, "خطا: محاسبه مبلغ کل بارنامه ناموفق بود.", err)
	}
	err = tx.Commit()
	if err != nil {
		return apperr.New(apperr.Invalid, "هنگام ویرایش بارنامه خطایی رخ داد.")
	}

	return nil
}

func (r *waybillRepository) Delete(ctx context.Context, waybillID int64) error {
	query := `
	DELETE FROM waybill WHERE id = ?`

	_, err := r.db.ExecContext(ctx, query, waybillID)
	if err != nil {
		return err
	}
	return nil
}

func (r *waybillRepository) GetTotalWaybillsWithDriver(ctx context.Context) (int64, error) {
	var count int64
	query := `
		SELECT COUNT(*) from waybill; 
	`

	err := r.db.QueryRowContext(ctx, query).Scan(&count)
	if err == sql.ErrNoRows {
		return 0, err
	}
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (r *waybillRepository) GetDriverTotalWaybill(ctx context.Context, driverID int64) (int64, error) {
	var count int64
	query := `
		SELECT COUNT(*) from waybill WHERE driver_id = ?; 
	`

	err := r.db.QueryRowContext(ctx, query, driverID).Scan(&count)
	if err == sql.ErrNoRows {
		return 0, err
	}
	if err != nil {
		return 0, err
	}

	return count, nil
}
