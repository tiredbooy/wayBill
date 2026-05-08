package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
)

type DriverRepository interface {
	Create(ctx context.Context, driver models.CreateDriverReq) error
	GetAllDrivers(ctx context.Context, q models.DriverFilters) (models.Page[models.DriverResponse], error)
	GetDriverByID(ctx context.Context, driverId int64) (models.DriverDetails, error)
	ExistsByID(ctx context.Context, driverID int64) (bool, error)
	ExistsByNationCode(ctx context.Context, nationalCode string) (bool, error)
	Update(ctx context.Context, driverId int64, req models.UpdateDriverReq) (models.DriverDetails, error)
	Delete(ctx context.Context, driverId int64) error
}

type driverRepository struct {
	db *sql.DB
}

func NewDriverRepository(db *sql.DB) DriverRepository {
	return &driverRepository{db: db}
}

func (r *driverRepository) Create(ctx context.Context, driver models.CreateDriverReq) error {
	query := `
		INSERT INTO driver
		(first_name, last_name, phone, vehicle_id, code, address,
		 national_code, email, license_number, license_expiry, birth_date, status)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	_, err := r.db.ExecContext(
		ctx,
		query,
		driver.FirstName,
		driver.LastName,
		driver.Phone,
		driver.VehicleID,
		driver.Code,
		driver.Address,
		driver.NationalCode,
		driver.Email,
		driver.LicenseNumber,
		driver.LicenseExpiry,
		driver.BirthDate,
		driver.Status,
	)
	if err != nil {
		return err
	}

	return nil
}

func (r *driverRepository) GetAllDrivers(ctx context.Context, q models.DriverFilters) (models.Page[models.DriverResponse], error) {
	offset := (q.Page - 1) * q.Limit

	where := "WHERE 1=1"
	args := []any{}

	if q.Search != "" {
		where += " AND (d.first_name LIKE ? OR d.last_name LIKE ? OR d.national_code LIKE ? OR d.phone LIKE ? OR d.id LIKE ?)"
		s := "%" + q.Search + "%"
		args = append(args, s, s, s, s, s)
	}

	if q.Status != "" {
		where += "AND d.status = ?"
		args = append(args, q.Status)
	}

	var total int64
	countSql := "SELECT COUNT(*) FROM driver"
	if err := r.db.QueryRowContext(ctx, countSql, args...).Scan(&total); err != nil {
		return models.Page[models.DriverResponse]{}, err
	}

	orderBy := "ORDER BY d.id"
	switch q.SortBy {
	case "national":
		orderBy = "ORDER BY d.national_code"
	case "name":
		orderBy = "ORDER BY d.first_name, d.last_name"
	case "phone":
		orderBy = "ORDER BY d.phone"
	case "status":
		orderBy = "ORDER BY d.status"
	case "code":
		orderBy = "ORDER BY d.code"
	case "hire_date":
		orderBy = "ORDER BY d.hire_date"
	}

	if q.OrderBy == "asc" {
		orderBy += " ASC"
	} else {
		orderBy += " DESC"
	}

	dataSql := fmt.Sprintf(
		`SELECT d.id, d.first_name, d.last_name, d.vehicle_id, d.national_code,
		d.phone, d.code, d.email, d.status, d.license_expiry, d.hire_date, d.created_at,
		COUNT(w.id) AS waybill_count
		FROM driver d
		LEFT JOIN waybill w ON d.id = w.driver_id
		%s
		GROUP BY d.id, d.first_name, d.last_name, d.vehicle_id, d.national_code,
	          d.phone, d.code, d.email, d.status, d.license_expiry, d.hire_date, d.created_at
		%s
		Limit ? OFFSET ? `, where, orderBy)

	rows, err := r.db.QueryContext(ctx, dataSql, append(args, q.Limit, offset)...)
	if err != nil {
		return models.Page[models.DriverResponse]{}, err
	}

	defer rows.Close()

	results := make([]models.DriverResponse, 0, q.Limit)
	for rows.Next() {
		var r models.DriverResponse
		if err := rows.Scan(&r.ID, &r.FirstName, &r.LastName, &r.VehicleID, &r.NationalCode, &r.Phone, &r.Code, &r.Email, &r.Status, &r.LicenseExpiry, &r.HireDate, &r.CreatedAt, &r.TotalWaybills); err != nil {
			return models.Page[models.DriverResponse]{}, err
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return models.Page[models.DriverResponse]{}, err
	}

	totalPages := (total + q.Limit - 1) / q.Limit
	return models.Page[models.DriverResponse]{
		Pagination: models.Pagination{
			TotalItems: total,
			TotalPage:  totalPages,
			HasNext:    q.Page < totalPages,
			HasPrev:    q.Page > 1,
		},
		Results: results,
	}, nil
}

func (r *driverRepository) GetDriverByID(ctx context.Context, driverId int64) (models.DriverDetails, error) {
	var res models.DriverDetails

	query := `
		SELECT
		driver.id, first_name, last_name, phone, vehicle_id, code, address, national_code, email, license_number,
		license_expiry, hire_date, birth_date, driver.status, driver.updated_at, driver.created_at, v.model AS vehicle_model, v.plate AS vehicle_plate
		FROM driver
		INNER JOIN vehicle v ON v.id = vehicle_id
		WHERE driver.id = ?
	`

	err := r.db.QueryRowContext(ctx, query, driverId).Scan(
		&res.ID,
		&res.FirstName,
		&res.LastName,
		&res.Phone,
		&res.VehicleID,
		&res.Code,
		&res.Address,
		&res.NationalCode,
		&res.Email,
		&res.LicenseNumber,
		&res.LicenseExpiry,
		&res.HireDate,
		&res.BirthDate,
		&res.Status,
		&res.UpdatedAt,
		&res.CreatedAt,
		&res.VehicleModel,
		&res.VehiclePlate,
	)
	if err == sql.ErrNoRows {
		return models.DriverDetails{}, apperr.New(apperr.OK, err.Error())
	}
	if err != nil {
		return models.DriverDetails{}, apperr.New(apperr.Internal, err.Error())
	}

	return res, nil
}

func (v *driverRepository) ExistsByID(ctx context.Context, driverID int64) (bool, error) {
	var id int64
	query := `
		SELECT id FROM driver WHERE id = ?
	`

	err := v.db.QueryRowContext(ctx, query, driverID).Scan(&id)
	if err == sql.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, err
	}
	return true, nil
}

func (v *driverRepository) ExistsByNationCode(ctx context.Context, nationalCode string) (bool, error) {
	var code string
	query := `SELECT national_code FROM driver WHERE national_code = ?`

	err := v.db.QueryRowContext(ctx, query, nationalCode).Scan(&code)
	if err == sql.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, err
	}

	return true, nil
}

func (r *driverRepository) Update(ctx context.Context, driverId int64, req models.UpdateDriverReq) (models.DriverDetails, error) {
	tx, err := r.db.Begin()

	if err != nil {
		return models.DriverDetails{}, apperr.New(apperr.Internal, "Failed to begin transaction")
	}
	defer tx.Rollback()

	var updates []string
	args := []interface{}{}
	argPos := 1

	if req.FirstName != nil {
		updates = append(updates, "first_name = ?")
		args = append(args, *req.FirstName)
		argPos++
	}

	if req.LastName != nil {
		updates = append(updates, "last_name = ?")
		args = append(args, *req.LastName)
		argPos++
	}

	if req.Phone != nil {
		updates = append(updates, "phone = ?")
		args = append(args, *req.Phone)
		argPos++
	}

	if req.VehicleID != nil {
		updates = append(updates, "vehicle_id = ?")
		args = append(args, *req.VehicleID)
		argPos++
	}

	if req.Code != nil {
		updates = append(updates, "code = ?")
		args = append(args, *req.Code)
		argPos++
	}

	if req.Address != nil {
		updates = append(updates, "address = ?")
		args = append(args, *req.Address)
		argPos++
	}

	if req.NationalCode != nil {
		updates = append(updates, "national_code = ?")
		args = append(args, *req.NationalCode)
		argPos++
	}

	if req.Email != nil {
		updates = append(updates, "email = ?")
		args = append(args, *req.Email)
		argPos++
	}

	if req.Address != nil {
		updates = append(updates, "address = ?")
		args = append(args, *req.Address)
		argPos++
	}

	if req.LicenseNumber != nil {
		updates = append(updates, "license_number = ?")
		args = append(args, *req.LicenseNumber)
		argPos++
	}

	if req.LicenseExpiry != nil {
		updates = append(updates, "license_expiry = ?")
		args = append(args, *req.LicenseExpiry)
		argPos++
	}

	if req.HireDate != nil {
		updates = append(updates, "hire_date = ?")
		args = append(args, *req.HireDate)
		argPos++
	}

	if req.BirthDate != nil {
		updates = append(updates, "birth_date = ?")
		args = append(args, *req.BirthDate)
		argPos++
	}

	if req.Status != nil {
		updates = append(updates, "status = ?")
		args = append(args, *req.Status)
		argPos++
	}

	if len(updates) > 0 {
		query := fmt.Sprintf("UPDATE driver SET %s WHERE id = ?", strings.Join(updates, ", "))
		args = append(args, driverId)

		_, err := tx.Exec(query, args...)
		if err != nil {
			return models.DriverDetails{}, apperr.New(apperr.Invalid, "خطا: برای ویرایش راننده فیلد های مورد نیاز را پرکنید.")
		}
	}

	err = tx.Commit()
	if err != nil {
		return models.DriverDetails{}, apperr.New(apperr.Invalid, "هنگام ویرایش راننده خطایی رخ داد.")
	}

	updatedDriver, err := r.GetDriverByID(ctx, driverId)
	if err != nil {
		log.Println("DRIVER ERRROR: ", err.Error())
		return models.DriverDetails{}, apperr.New(apperr.Internal, "هنگام دریافت اطلاعات راننده خطایی رخ داد")
	}

	return updatedDriver, nil
}

func (r *driverRepository) Delete(ctx context.Context, driverId int64) error {
	query := `
	DELETE FROM driver WHERE id = ?`

	_, err := r.db.ExecContext(ctx, query, driverId)
	if err != nil {
		return err
	}
	return nil
}
