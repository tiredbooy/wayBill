package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
)

type CustomerRepository interface {
	Create(ctx context.Context, req models.CreateCustomerReq) error
	GetAllCustomers(ctx context.Context, q models.CustomerFilters) (models.Page[models.Customer], error)
	GetCustomerByID(ctx context.Context, customerID int64) (models.Customer, error)
	Update(ctx context.Context, customerID int64, req models.UpdateCustomerReq) (models.Customer, error)
	Delete(ctx context.Context, customerID int64) error
}

type customerRepository struct {
	db *sql.DB
}

func NewCustomerRepository(db *sql.DB) CustomerRepository {
	return &customerRepository{db: db}
}

func (r *customerRepository) Create(ctx context.Context, req models.CreateCustomerReq) error {
	query := `
		INSERT INTO customer
		(name, national_id, economic_code, phone_mobile, phone_fixed, address, postal_code, city, province, email, notes)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	_, err := r.db.ExecContext(ctx, query, req.Name, req.NationalID, req.EconomicCode, req.PhoneMobile, req.PhoneFixed, req.Address, req.PostalCode, req.City, req.Province, req.Email, req.Notes)
	if err != nil {
		return err
	}

	return nil
}

func (r *customerRepository) GetAllCustomers(ctx context.Context, q models.CustomerFilters) (models.Page[models.Customer], error) {
	offset := (q.Page - 1) * q.Limit

	where := "WHERE 1=1"
	args := []any{}

	if q.Search != "" {
		where += " AND (name LIKE ? OR phone_mobile LIKE ? OR city LIKE ? OR address LIKE ? OR id LIKE ?)"
		s := "%" + q.Search + "%"
		args = append(args, s, s, s, s, s)
	}

	var total int64

	countSql := "SELECT COUNT(*) FROM customer"
	if err := r.db.QueryRowContext(ctx, countSql, args...).Scan(&total); err != nil {
		return models.Page[models.Customer]{}, err
	}

	orderBy := "ORDER BY id"
	switch q.SortBy {
	case "name":
		orderBy = "ORDER BY name"
	case "phone_mobile":
		orderBy = "ORDER BY phone_mobile"
	case "phone_fixed":
		orderBy = "ORDER BY phone_fixed"
	case "city":
		orderBy = "ORDER BY city"
	case "economic_code":
		orderBy = "ORDER BY economic_code"
	case "national_code":
		orderBy = "ORDER BY national_code"
	}

	if q.OrderBy == "asc" {
		orderBy += " ASC"
	} else {
		orderBy += " DESC"
	}

	dataSql := `
		SELECT id, name, national_id, economic_code, phone_mobile, phone_fixed, address, postal_code, city, province, email, notes, created_at, updated_at
		FROM customer
	` + " " + where + " " + orderBy + " LIMIT ? OFFSET ?"

	rows, err := r.db.QueryContext(ctx, dataSql, append(args, q.Limit, offset)...)
	if err != nil {
		return models.Page[models.Customer]{}, err
	}

	defer rows.Close()

	results := make([]models.Customer, 0, q.Limit)
	for rows.Next() {
		var r models.Customer
		if err := rows.Scan(&r.ID, &r.Name, &r.NationalID, &r.EconomicCode, &r.PhoneMobile, &r.PhoneFixed, &r.Address, &r.PostalCode, &r.City, &r.Province, &r.Email, &r.Notes, &r.CreatedAt, &r.UpdatedAt); err != nil {
			return models.Page[models.Customer]{}, err
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return models.Page[models.Customer]{}, err
	}

	totalPages := (total + q.Limit - 1) / q.Limit
	return models.Page[models.Customer]{
		Pagination: models.Pagination{
			TotalItems: total,
			TotalPage:  totalPages,
			HasNext:    q.Page < totalPages,
			HasPrev:    q.Page > 1,
		},
		Results: results,
	}, nil

}

func (r *customerRepository) GetCustomerByID(ctx context.Context, customerID int64) (models.Customer, error) {
	var res models.Customer

	query := `SELECT id, name, national_id, economic_code, phone_mobile, phone_fixed, address, postal_code, city, province, email, notes, created_at, updated_at FROM customer WHERE id = ?`

	err := r.db.QueryRowContext(ctx, query, customerID).Scan(&res.ID, &res.Name, &res.NationalID, &res.EconomicCode, &res.PhoneMobile, &res.PhoneFixed, &res.Address, &res.PostalCode, &res.City, &res.Province, &res.Email, &res.Notes, &res.CreatedAt, &res.UpdatedAt)
	if err != nil {
		return models.Customer{}, err
	}

	return res, nil
}

func (r *customerRepository) Update(ctx context.Context, customerID int64, req models.UpdateCustomerReq) (models.Customer, error) {
	tx, err := r.db.Begin()

	if err != nil {
		return models.Customer{}, apperr.New(apperr.Internal, "Failed to begin transaction")
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

	if req.NationalID != nil {
		updates = append(updates, "national_id = ?")
		args = append(args, strings.TrimSpace(*req.NationalID))
		argPos++
	}

	if req.EconomicCode != nil {
		updates = append(updates, "economic_code = ?")
		args = append(args, strings.TrimSpace(*req.EconomicCode))
		argPos++
	}

	if req.PhoneMobile != nil {
		updates = append(updates, "phone_mobile = ?")
		args = append(args, strings.TrimSpace(*req.PhoneMobile))
		argPos++
	}

	if req.PhoneFixed != nil {
		updates = append(updates, "phone_fixed = ?")
		args = append(args, strings.TrimSpace(*req.PhoneFixed))
		argPos++
	}

	if req.Address != nil {
		updates = append(updates, "address = ?")
		args = append(args, strings.TrimSpace(*req.Address))
		argPos++
	}

	if req.PostalCode != nil {
		updates = append(updates, "postal_code = ?")
		args = append(args, strings.TrimSpace(*req.PostalCode))
		argPos++
	}

	if req.City != nil {
		updates = append(updates, "city = ?")
		args = append(args, strings.TrimSpace(*req.City))
		argPos++
	}

	if req.Province != nil {
		updates = append(updates, "province = ?")
		args = append(args, strings.TrimSpace(*req.Province))
		argPos++
	}

	if req.Email != nil {
		updates = append(updates, "email = ?")
		args = append(args, strings.TrimSpace(*req.Email))
		argPos++
	}

	if req.Notes != nil {
		updates = append(updates, "notes = ?")
		args = append(args, strings.TrimSpace(*req.Notes))
		argPos++
	}

	if len(updates) > 0 {
		query := fmt.Sprintf("UPDATE customer SET %s WHERE id = ?", strings.Join(updates, ", "))
		args = append(args, customerID)

		_, err := tx.Exec(query, args...)
		if err != nil {
			return models.Customer{}, apperr.New(apperr.Invalid, "خطا: برای ویرایش فیلد های مورد نیاز را پرکنید.")
		}
	}

	err = tx.Commit()
	if err != nil {
		return models.Customer{}, apperr.New(apperr.Invalid, "هنگام ویرایش خطایی رخ داد.")
	}

	updatedDriver, err := r.GetCustomerByID(ctx, customerID)
	if err != nil {
		return models.Customer{}, apperr.New(apperr.Internal, "هنگام دریافت اطلاعات خطایی رخ داد")
	}

	return updatedDriver, nil
}

func (r *customerRepository) Delete(ctx context.Context, customerID int64) error {
	query := `
	DELETE FROM customer WHERE id = ?`

	_, err := r.db.ExecContext(ctx, query, customerID)
	if err != nil {
		return err
	}
	return nil
}
