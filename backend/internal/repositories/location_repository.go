package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
)

type LocationRepository interface {
	Create(ctx context.Context, req models.LocationReq) error
	GetAllLocations(ctx context.Context) ([]models.Location, error)
	GetLocationByID(ctx context.Context, locationID int64) (models.Location, error)
	ExistsByID(ctx context.Context, locationID int64) (bool, error)
	Update(ctx context.Context, locationID int64, req models.LocationReq) (models.Location, error)
	Delete(ctx context.Context, locationID int64) error
}

type locationRepository struct {
	db *sql.DB
}

func NewLocationRepository(db *sql.DB) LocationRepository {
	return &locationRepository{db: db}
}

func (r *locationRepository) Create(ctx context.Context, req models.LocationReq) error {
	query := `
		INSERT INTO location
		(name, province, is_terminal, address)
		VALUES (?, ?, ?, ?)
	`

	_, err := r.db.ExecContext(ctx, query, req.Name, req.Province, req.IsTerminal, req.Address)
	if err != nil {
		return err
	}

	return nil
}

func (r *locationRepository) GetAllLocations(ctx context.Context) ([]models.Location, error) {
	query := `SELECT * FROM location`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return []models.Location{}, err
	}

	defer rows.Close()

	var results []models.Location
	for rows.Next() {
		var r models.Location
		if err := rows.Scan(&r.ID, &r.Name, &r.Province, &r.IsTerminal, &r.Address); err != nil {
			return []models.Location{}, err
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return []models.Location{}, err
	}

	return results, nil

}

func (r *locationRepository) GetLocationByID(ctx context.Context, locationID int64) (models.Location, error) {
	var res models.Location

	query := `SELECT id, name, province, is_terminal FROM location WHERE id = ?`

	err := r.db.QueryRowContext(ctx, query, locationID).Scan(&res.ID, &res.Name, &res.Province, &res.IsTerminal, &res.Address)
	if err != nil {
		return models.Location{}, err
	}

	return res, nil
}

func (v *locationRepository) ExistsByID(ctx context.Context, locationID int64) (bool, error) {
	var id int64
	query := `
		SELECT id FROM location WHERE id = ?
	`

	err := v.db.QueryRowContext(ctx, query, locationID).Scan(&id)
	if err == sql.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, err
	}
	return true, nil
}

func (r *locationRepository) Update(ctx context.Context, locationID int64, req models.LocationReq) (models.Location, error) {
	tx, err := r.db.Begin()

	if err != nil {
		return models.Location{}, apperr.New(apperr.Internal, "Failed to begin transaction")
	}
	defer tx.Rollback()

	var updates []string
	args := []interface{}{}
	argPos := 1

	if req.Name != nil {
		updates = append(updates, "name = ?")
		args = append(args, strings.TrimSpace(*req.Name))
		argPos++
	}

	if req.Province != nil {
		updates = append(updates, "province = ?")
		args = append(args, strings.TrimSpace(*req.Province))
		argPos++
	}

	if req.IsTerminal != nil {
		updates = append(updates, "is_terminal = ?")
		args = append(args, *req.IsTerminal)
		argPos++
	}

	if req.Address != nil {
		updates = append(updates, "address = ?")
		args = append(args, *req.Address)
		argPos++
	}

	if len(updates) > 0 {
		query := fmt.Sprintf("UPDATE location SET %s WHERE id = ?", strings.Join(updates, ", "))
		args = append(args, locationID)

		_, err := tx.Exec(query, args...)
		if err != nil {
			return models.Location{}, apperr.New(apperr.Invalid, "خطا: برای ویرایش فیلد های مورد نیاز را پرکنید.")
		}
	}

	err = tx.Commit()
	if err != nil {
		return models.Location{}, apperr.New(apperr.Invalid, "هنگام ویرایش خطایی رخ داد.")
	}

	updatedLocation, err := r.GetLocationByID(ctx, locationID)
	if err != nil {
		return models.Location{}, apperr.New(apperr.Internal, "هنگام دریافت اطلاعات خطایی رخ داد")
	}

	return updatedLocation, nil
}

func (r *locationRepository) Delete(ctx context.Context, locationID int64) error {
	query := `
	DELETE FROM location WHERE id = ?`

	_, err := r.db.ExecContext(ctx, query, locationID)
	if err != nil {
		return err
	}
	return nil
}
