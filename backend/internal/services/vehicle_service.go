package services

import (
	"context"
	"errors"
	"log"
	"strings"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
	"waybill/backend/internal/repositories"
)

type VehicleService struct {
	vehicleRepo repositories.VehicleRepository
}

func NewVehicleService(vehicleRepo repositories.VehicleRepository) *VehicleService {
	return &VehicleService{vehicleRepo: vehicleRepo}
}

func (s *VehicleService) CreateVehicle(ctx context.Context, req models.Vehicle) error {

	if req.Plate == "" {
		return apperr.New(apperr.Invalid, "خطا: لطفا پلاک وسیله نقلیه را وارد کنید")
	}

	if req.Model == "" {
		return errors.New("خطا: لطفا مدل وسیله نقلیه را وارد کنید.")
	}

	if req.Status != "active" && req.Status != "inactive" && req.Status != "maintenance" {
		req.Status = "active"
	}

	if req.Color != "" {
		req.Color = strings.ToLower(req.Color)
	}

	exists, err := s.vehicleRepo.ExistsByPlate(ctx, req.Plate)
	if err != nil {
		log.Printf("[VehicleService.CreateVehicle] ExistsByPlate failed | plate=%q | err=%v", req.Plate, err)
		return apperr.Wrap(apperr.Internal, "خطا: بررسی پلاک با خطا مواجه شد.", err)
	}
	log.Printf("[VehicleService.CreateVehicle] ExistsByPlate ok | plate=%q | exists=%v", req.Plate, exists)
	if exists {
		return apperr.New(apperr.Conflict, "خطا: وسیله نقلیه با این پلاک از قبل وجود دارد.")
	}

	req.Model = strings.TrimSpace(req.Model)
	req.Plate = strings.TrimSpace(req.Plate)

	err = s.vehicleRepo.Create(ctx, req)
	if err != nil {
		return errors.New("Failed to Create Vehicle.")
	}

	return nil
}

func (s *VehicleService) GetAllVehicles(ctx context.Context, q models.VehicleFilters) (models.Page[models.VehiclesResponse], error) {
	if q.Page <= 0 {
		q.Page = 1
	}

	if q.Limit <= 0 || q.Limit > 100 {
		q.Limit = 20
	}

	q.Search = strings.TrimSpace(q.Search)

	vehicles, err := s.vehicleRepo.GetAll(ctx, q)
	if err != nil {
		log.Println("ERROR: ", err.Error())
		return models.Page[models.VehiclesResponse]{}, apperr.New(apperr.Internal, "خطا: دریافت لیست وسایل نقلیه با خطا مواجه شد.")
	}

	return vehicles, nil
}

func (s *VehicleService) GetVehicleByID(ctx context.Context, vehicleID int64) (models.VehiclesResponse, error) {
	if vehicleID <= 0 {
		return models.VehiclesResponse{}, apperr.New(apperr.Invalid, "خطا: شناسه وارد شده صحیح نیست.")
	}

	vehicle, err := s.vehicleRepo.GetVehicle(ctx, vehicleID)

	if err != nil {
		return models.VehiclesResponse{}, apperr.New(apperr.Internal, "خطا: دریافت اطلاعات وسیله نقلیه با خطا مواجه شد.")
	}

	return vehicle, nil
}

func (s *VehicleService) UpdateVehicle(ctx context.Context, vehicleID int64, req models.UpdateVehicleReq) (models.VehiclesResponse, error) {
	if vehicleID <= 0 {
		return models.VehiclesResponse{}, apperr.New(apperr.Invalid, "خطا: شناسه وسیله نقلیه نامعتبر است.")
	}

	vehicle, err := s.vehicleRepo.Update(ctx, vehicleID, req)
	if err != nil {
		return models.VehiclesResponse{}, apperr.New(apperr.Internal, apperr.Message(err))
	}

	return vehicle, nil
}

func (s *VehicleService) DeleteVehicle(ctx context.Context, vehicleID int64) error {
	log.Println("vehicleID:", vehicleID)
	if vehicleID <= 0 {
		return apperr.New(apperr.Invalid, "خطا: شناسه وسیله نقلیه نامعتبر است.")
	}

	err := s.vehicleRepo.Delete(ctx, vehicleID)
	if err != nil {
		log.Println("ERROR: ", err.Error())
		return apperr.New(apperr.Internal, "خطا: حذف وسیله نقلیه با خطا مواجه شد.")
	}

	return nil
}
