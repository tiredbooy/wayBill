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

type VehicleRepository interface {
	Create(ctx context.Context, vehicle models.Vehicle) error
	ExistsByID(ctx context.Context, VehicleID int64) (bool, error)
	ExistsByPlate(ctx context.Context, plate string) (bool, error)
	GetAll(ctx context.Context, q models.VehicleFilters) (models.Page[models.VehiclesResponse], error)
	GetVehicle(ctx context.Context, vehicleID int64) (models.VehiclesResponse, error)
	Update(ctx context.Context, vehicleID int64, update models.UpdateVehicleReq) (models.VehiclesResponse, error)
	Delete(ctx context.Context, vehicleID int64) error
}

type vehicleRepository struct {
	db *sql.DB
}

func NewVehicleRepository(db *sql.DB) VehicleRepository {
	return &vehicleRepository{db: db}
}

func (v *vehicleRepository) Create(ctx context.Context, vehicle models.Vehicle) error {
	query := `
	INSERT INTO vehicle (plate, model, year, capacity, color, status, insurance_expiry, notes)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	_, err := v.db.ExecContext(ctx, query, vehicle.Plate, vehicle.Model, vehicle.Year, vehicle.Capacity, vehicle.Color, vehicle.Status, vehicle.InsuranceExpiry, vehicle.Notes)

	if err != nil {
		return err
	}

	return nil
}

func (v *vehicleRepository) ExistsByID(ctx context.Context, VehicleID int64) (bool, error) {
	var id int64
	query := `
		SELECT id FROM vehicle WHERE id = ?
	`

	err := v.db.QueryRowContext(ctx, query, VehicleID).Scan(&id)
	if err == sql.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, err
	}
	return true, nil
}

func (v *vehicleRepository) ExistsByPlate(ctx context.Context, plate string) (bool, error) {
	var id int64
	const q = `SELECT id FROM vehicle WHERE plate = ?`

	err := v.db.QueryRowContext(ctx, q, plate).Scan(&id)

	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		fmt.Println("ERROR: ", err.Error())
		return false, err
	}

	return true, nil
}

func (v *vehicleRepository) GetAll(ctx context.Context, q models.VehicleFilters) (models.Page[models.VehiclesResponse], error) {

	offset := (q.Page - 1) * q.Limit

	where := "WHERE 1=1"
	args := []any{}

	if q.Search != "" {
		where += " AND (v.model LIKE ? OR v.plate LIKE ? OR v.notes LIKE ?)"
		s := "%" + q.Search + "%"
		args = append(args, s, s, s)
	}
	if q.Status != "" {
		where += " AND v.status = ?"
		args = append(args, q.Status)
	}

	var total int64
	countSQL := "SELECT COUNT(*) FROM vehicle " + where
	if err := v.db.QueryRowContext(ctx, countSQL, args...).Scan(&total); err != nil {
		return models.Page[models.VehiclesResponse]{}, err
	}

	orderBy := "ORDER BY v.id"
	switch q.SortBy {
	case "model":
		orderBy = "ORDER BY v.model"
	case "plate":
		orderBy = "ORDER BY v.plate"
	}
	if q.OrderBy == "asc" {
		orderBy += " ASC"
	} else {
		orderBy += " DESC"
	}

	dataSQL := `
		SELECT v.id, v.model, v.plate, v.status, v.year, v.capacity, v.color, v.insurance_expiry, v.notes, v.updated_at, v.created_at, d.first_name || " " || d.last_name AS driver_name
		FROM vehicle v
		LEFT JOIN driver d ON d.vehicle_id = v.id
	` + " " + where + " " + orderBy + " LIMIT ? OFFSET ?"

	rows, err := v.db.QueryContext(ctx, dataSQL, append(args, q.Limit, offset)...)
	if err != nil {
		log.Println("ERROR REPO: ", err.Error())
		return models.Page[models.VehiclesResponse]{}, err
	}
	defer rows.Close()

	results := make([]models.VehiclesResponse, 0, q.Limit)
	for rows.Next() {
		var r models.VehiclesResponse
		if err := rows.Scan(&r.ID, &r.Model, &r.Plate, &r.Status, &r.Year, &r.Capacity, &r.Color, &r.InsuranceExpiry, &r.Notes, &r.UpdatedAt, &r.CreatedAt, &r.DriverName); err != nil {
			return models.Page[models.VehiclesResponse]{}, err
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return models.Page[models.VehiclesResponse]{}, err
	}

	totalPages := (total + q.Limit - 1) / q.Limit
	return models.Page[models.VehiclesResponse]{
		Pagination: models.Pagination{
			TotalItems: total,
			TotalPage:  totalPages,
			HasPrev:    q.Page > 1,
			HasNext:    q.Page < totalPages,
		},
		Results: results,
	}, nil
}

func (v *vehicleRepository) GetVehicle(ctx context.Context, vehicleID int64) (models.VehiclesResponse, error) {
	var r models.VehiclesResponse

	const q = `
		SELECT v.id, v.model, v.plate, v.status, v.year, v.capacity, v.color, v.insurance_expiry, v.notes, v.updated_at, v.created_at, d.first_name || " " || d.last_name AS driver_name
		FROM vehicle v
		LEFT JOIN driver d ON d.vehicle_id = v.id
		WHERE v.id = ?
	`
	err := v.db.QueryRowContext(ctx, q, vehicleID).Scan(&r.ID, &r.Model, &r.Plate, &r.Status, &r.Year, &r.Capacity, &r.Color, &r.InsuranceExpiry, &r.Notes, &r.UpdatedAt, &r.CreatedAt, &r.DriverName)
	if err == sql.ErrNoRows {
		return models.VehiclesResponse{}, err
	}
	if err != nil {
		log.Println("ERROR RES: ", err.Error())
		return models.VehiclesResponse{}, err
	}
	return r, nil
}

func (v *vehicleRepository) Update(ctx context.Context, vehicleID int64, req models.UpdateVehicleReq) (models.VehiclesResponse, error) {
	tx, err := v.db.Begin()
	if err != nil {
		return models.VehiclesResponse{}, apperr.New(apperr.Internal, "Failed to begin transaction")
	}
	defer tx.Rollback()

	var updates []string
	args := []interface{}{}
	argPos := 1

	if req.Plate != nil {
		updates = append(updates, "plate = ?")
		args = append(args, *req.Plate)
		argPos++
	}

	if req.Model != nil {
		updates = append(updates, "model = ?")
		args = append(args, *req.Model)
		argPos++
	}

	if req.Year != nil {
		updates = append(updates, "year = ?")
		args = append(args, *req.Year)
		argPos++
	}

	if req.Capacity != nil {
		updates = append(updates, "capacity = ?")
		args = append(args, *req.Capacity)
		argPos++
	}

	if req.Color != nil {
		updates = append(updates, "color = ?")
		args = append(args, strings.ToLower(*req.Color))
		argPos++
	}

	if req.Status != nil {
		updates = append(updates, "status = ?")
		args = append(args, *req.Status)
		argPos++
	}

	if req.InsuranceExpiry != nil {
		updates = append(updates, "insurance_expiry = ?")
		args = append(args, req.InsuranceExpiry)
		argPos++
	}

	if req.Notes != nil {
		updates = append(updates, "notes = ?")
		args = append(args, *req.Notes)
		argPos++
	}

	if len(updates) > 0 {
		query := fmt.Sprintf("UPDATE vehicle SET %s WHERE id = ?", strings.Join(updates, ", "))
		args = append(args, vehicleID)

		_, err := tx.Exec(query, args...)
		if err != nil {
			log.Println("ERROR: ", err.Error())
			return models.VehiclesResponse{}, apperr.New(apperr.Invalid, "خطا: برای ویرایش وسیله نقلیه فیلد های مورد نیاز را پرکنید.")
		}
	}

	err = tx.Commit()
	if err != nil {
		return models.VehiclesResponse{}, apperr.New(apperr.Invalid, "هنگام ویرایش وسیله نقلیه خطایی رخ داد.")
	}

	updatedVehicle, err := v.GetVehicle(ctx, vehicleID)
	if err != nil {
		return models.VehiclesResponse{}, apperr.New(apperr.Internal, "هنگام دریافت اطلاعات وسیله نقلیه خطایی رخ داد")
	}

	return updatedVehicle, nil
}

func (v *vehicleRepository) Delete(ctx context.Context, vehicleID int64) error {
	log.Println("ID:", vehicleID)
	query := `
	DELETE FROM vehicle WHERE id = ?`

	_, err := v.db.ExecContext(ctx, query, vehicleID)
	if err != nil {
		log.Println("ERROR REPO: ", err.Error())
		return err
	}
	return nil
}
