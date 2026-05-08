package services

import (
	"context"
	"log"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
	"waybill/backend/internal/repositories"
)

type SettingService struct {
	settingRepo repositories.SettingRepository
}

func NewSettingService(settingRepo repositories.SettingRepository) *SettingService {
	return &SettingService{settingRepo: settingRepo}
}

func ptr[T any](v T) *T {
    return &v
}

func (s *SettingService) InitializeSettings(ctx context.Context) error {
	exists, err := s.settingRepo.Exists(ctx)
	if err != nil {
		return err
	}
	if !exists {
		defaultReq := models.SettingReq{
    	CompanyName:    ptr("بارنامه"),
    	Address:        ptr(""),
    	Contact:        &models.ContactInfo{}, 
    	CommissionRate: ptr(0.0),
    	PreferredTheme: ptr("light"),
		}
		return s.settingRepo.Create(ctx, defaultReq)
	}
	return nil
}

func (s *SettingService) CreateSetting(ctx context.Context, req models.SettingReq) error {
	if *req.CompanyName == "" {
		return apperr.New(apperr.Invalid, "خطا: لطفا نام شرکت را مشخص نمایید.")
	}

	exists, err := s.settingRepo.Exists(ctx)
	if err != nil {
		log.Println("ERROR checking existence: ", err.Error())
		return apperr.New(apperr.Internal, "خطا در بررسی تنظیمات. لطفا مجددا تلاش کنید.")
	}
	if exists {
		return apperr.New(apperr.Invalid, "تنظیمات قبلا ایجاد شده است. برای بروزرسانی از قسمت ویرایش استفاده کنید.")
	}

	err = s.settingRepo.Create(ctx, req)
	if err != nil {
		log.Println("ERROR: ", err.Error())
		return apperr.New(apperr.Invalid, "هنگام ایجاد تنظیمات خطایی رخ داد.")
	}

	return nil
}

func (s *SettingService) GetSetting(ctx context.Context) (models.Setting, error) {
	setting, err := s.settingRepo.Get(ctx)
	if err != nil {
		log.Println("ERROR: ", err.Error())
		return models.Setting{}, apperr.New(apperr.Internal, "تنظیمات یافت نشد.")
	}

	return setting, nil
}

func (s *SettingService) UpdateSetting(ctx context.Context, req models.SettingReq) (models.Setting, error) {
	updated, err := s.settingRepo.Update(ctx, req)
	if err != nil {
		log.Println("ERROR: ", err.Error())
		return models.Setting{}, apperr.New(apperr.Invalid, "هنگام بروزرسانی تنظیمات خطایی رخ داد.")
	}

	return updated, nil
}
