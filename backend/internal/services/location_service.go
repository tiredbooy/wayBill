package services

import (
	"context"
	"log"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
	"waybill/backend/internal/repositories"
)

type LocationService struct {
	locationRepo repositories.LocationRepository
}

func NewLocationService(locationRepo repositories.LocationRepository) *LocationService {
	return &LocationService{locationRepo: locationRepo}
}

func (s *LocationService) CreateLocation(ctx context.Context, req models.LocationReq) error {
	if *req.Name == "" {
		return apperr.New(apperr.Invalid, "خطا: لطفا یک نام برای مکان مورد نظر مشخص نمایید.")
	}

	err := s.locationRepo.Create(ctx, req)
	if err != nil {
		log.Println("ERROR: ", err.Error())
		return apperr.New(apperr.Invalid, "هنگام ساخت خطایی رخ داد.")
	}

	return nil
}

func (s *LocationService) GetLocations(ctx context.Context) ([]models.Location, error) {

	locations, err := s.locationRepo.GetAllLocations(ctx)
	if err != nil {
		return []models.Location{}, apperr.New(apperr.Internal, "هنگام دریافت اطلاعات خطایی رخ داد.")
	}

	return locations, nil
}

func (s *LocationService) GetLocation(ctx context.Context, locationID int64) (models.Location, error) {
	if locationID <= 0 {
		return models.Location{}, apperr.New(apperr.Invalid, "خطا: لطفا یک شناسه صحیح وارد نمایید")
	}

	location, err := s.locationRepo.GetLocationByID(ctx, locationID)
	if err != nil {
		return models.Location{}, apperr.New(apperr.Internal, "هنگام دریافت اطلاعات خطایی رخ داد.")
	}

	return location, nil
}

func (s *LocationService) UpdateLocation(ctx context.Context, locationID int64, req models.LocationReq) (models.Location, error) {
	if locationID <= 0 {
		return models.Location{}, apperr.New(apperr.Invalid, "خطا: لطفا یک شناسه صحیح وارد نمایید")
	}

	location, err := s.locationRepo.Update(ctx, locationID, req)
	if err != nil {
		return models.Location{}, apperr.New(apperr.Internal, "هنگام ویرایش خطایی رخ داد، لحظاتی دیگر امتحان نمایید")
	}

	return location, nil
}

func (s *LocationService) DeleteLocation(ctx context.Context, locationID int64) error {
	if locationID <= 0 {
		return apperr.New(apperr.Invalid, "خطا: شناسه نامعتبر است.")
	}

	err := s.locationRepo.Delete(ctx, locationID)
	if err != nil {
		return apperr.New(apperr.Internal, "خطا: حذف با خطا مواجه شد.")
	}

	return nil
}
