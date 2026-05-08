package repositories

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"time"
	"waybill/backend/internal/models"
)

type SettingRepository interface {
	Create(ctx context.Context, req models.SettingReq) error
	Get(ctx context.Context) (models.Setting, error)
	Update(ctx context.Context, req models.SettingReq) (models.Setting, error)
	Exists(ctx context.Context) (bool, error)
	Delete(ctx context.Context) error
}

type settingRepository struct {
	db *sql.DB
}

func NewSettingRepository(db *sql.DB) SettingRepository {
	return &settingRepository{db: db}
}

func (r *settingRepository) Create(ctx context.Context, req models.SettingReq) error {
	query := `
        INSERT INTO setting
        (id, company_name, address, contact, commission_rate, preferred_theme, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `
	contactJSON, err := json.Marshal(req.Contact)
	if err != nil {
		return fmt.Errorf("failed to marshal contact info: %w", err)
	}

	_, err = r.db.ExecContext(ctx, query,
		1,
		req.CompanyName,
		req.Address,
		contactJSON,
		req.CommissionRate,
		req.PreferredTheme,
		time.Now(),
	)
	return err
}

func (r *settingRepository) Get(ctx context.Context) (models.Setting, error) {
    var setting models.Setting
    var contactBytes []byte

    query := `SELECT id, company_name, address, contact, commission_rate, preferred_theme, updated_at
              FROM setting WHERE id = 1 LIMIT 1`

    err := r.db.QueryRowContext(ctx, query).Scan(
        &setting.ID,
        &setting.CompanyName,
        &setting.Address,
        &contactBytes,
        &setting.CommissionRate,
        &setting.PreferredTheme,
        &setting.UpdatedAt,
    )
    if err != nil {
        if err == sql.ErrNoRows {
            return setting, fmt.Errorf("settings not found")
        }
        return setting, err
    }

    if setting.PreferredTheme == nil || *setting.PreferredTheme == "" {
        defaultTheme := "system"
        setting.PreferredTheme = &defaultTheme
    }

    if err := json.Unmarshal(contactBytes, &setting.Contact); err != nil {
        return setting, fmt.Errorf("failed to unmarshal contact: %w", err)
    }

    return setting, nil
}

func (r *settingRepository) Update(ctx context.Context, req models.SettingReq) (models.Setting, error) {
    var setClauses []string
    var args []any

    if req.CompanyName != nil {
        setClauses = append(setClauses, "company_name = ?")
        args = append(args, *req.CompanyName)
    }
    if req.Address != nil {
        setClauses = append(setClauses, "address = ?")
        args = append(args, *req.Address)
    }
    if req.Contact != nil {
        contactJSON, err := json.Marshal(req.Contact)
        if err != nil {
            return models.Setting{}, fmt.Errorf("failed to marshal contact: %w", err)
        }
        setClauses = append(setClauses, "contact = ?")
        args = append(args, contactJSON)
    }
    if req.CommissionRate != nil {
        setClauses = append(setClauses, "commission_rate = ?")
        args = append(args, *req.CommissionRate)
    }
    if req.PreferredTheme != nil {
        setClauses = append(setClauses, "preferred_theme = ?")
        args = append(args, *req.PreferredTheme)
    }

    // If nothing to update, just return current settings (or you could treat as no-op)
    if len(setClauses) == 0 {
        return r.Get(ctx)
    }

    // Always bump the timestamp
    setClauses = append(setClauses, "updated_at = ?")
    args = append(args, time.Now())

    query := fmt.Sprintf("UPDATE setting SET %s WHERE id = 1", strings.Join(setClauses, ", "))

    _, err := r.db.ExecContext(ctx, query, args...)
    if err != nil {
        return models.Setting{}, err
    }

    return r.Get(ctx)
}

func (r *settingRepository) Exists(ctx context.Context) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM setting WHERE id = 1)`
	err := r.db.QueryRowContext(ctx, query).Scan(&exists)
	return exists, err
}


func (r *settingRepository) Delete(ctx context.Context) error {
	query := `DELETE FROM setting WHERE id = 1`
	_, err := r.db.ExecContext(ctx, query)
	return err
}
