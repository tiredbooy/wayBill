package services

import (
	"context"
	"log"
	"strings"
	"time"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
	"waybill/backend/internal/repositories"

	"github.com/google/uuid"
)

type DriverService struct {
	driverRepo  repositories.DriverRepository
	vehicleRepo repositories.VehicleRepository
}

func NewDriverService(driverRepo repositories.DriverRepository, vehicleRepo repositories.VehicleRepository) *DriverService {
	return &DriverService{driverRepo: driverRepo, vehicleRepo: vehicleRepo}
}

func (s *DriverService) CreateDriver(ctx context.Context, req models.CreateDriverReq) error {
	if req.VehicleID != nil {
		vehicleExists, err := s.vehicleRepo.ExistsByID(ctx, *req.VehicleID)

	if err != nil {
		return apperr.New(apperr.Internal, "هنگام دریافت اطلاعات وسیله ی نفلیه خطایی رخ داد")
	}

	if !vehicleExists {
		return apperr.New(apperr.Internal, "وسیله ی نفلیه وجود ندارد")
	}
	}

	if req.Status == "" {
		req.Status = "active"
	}

	if req.Code == "" {
		driverId, err := uuid.NewRandom()
		if err == nil {
			req.Code = driverId.String()
		} else {
			driverCode := req.FirstName + req.LastName + time.UnixDate
			req.Code = driverCode
		}
	}

	if req.NationalCode != nil {
		exists, err := s.driverRepo.ExistsByNationCode(ctx, *req.NationalCode)
		if err != nil {
			return apperr.New(apperr.Internal, "هنگام ساخت راننده خطایی رخ داد.")
		}

		if exists {
			return apperr.New(apperr.Internal, "خطا: کدملی قبلا استفاده شده.")
		}
	}

	err := s.driverRepo.Create(ctx, req)
	if err != nil {
		return apperr.New(apperr.Internal, "هنگام ساخت راننده خطایی رخ داد.")
	}

	return nil
}

func (s *DriverService) GetDriver(ctx context.Context, driverId int64) (models.DriverDetails, error) {
	if driverId <= 0 {
		return models.DriverDetails{}, apperr.New(apperr.Invalid, "خطا: شناسه وارد شده صحیح نیست.")
	}

	driver, err := s.driverRepo.GetDriverByID(ctx, driverId)
	if err != nil {
		log.Println("ERROR: ", err.Error())
		return models.DriverDetails{}, apperr.New(apperr.Invalid, "خطا: دریافت اطلاعات وسیله نقلیه با خطا مواجه شد.")
	}

	return driver, nil
}

func (s *DriverService) GetDrivers(ctx context.Context, q models.DriverFilters) (models.Page[models.DriverResponse], error) {
	if q.Page < 1 {
		q.Page = 1
	}

	if q.Limit <= 0 || q.Limit > 100 {
		q.Limit = 20
	}

	q.Search = strings.TrimSpace(q.Search)

	drivers, err := s.driverRepo.GetAllDrivers(ctx, q)

	if err != nil {
		log.Println("ERROR ", err.Error())
		return models.Page[models.DriverResponse]{}, apperr.New(apperr.NotFound, "خطا: دریافت اطلاعات وسیله نقلیه با خطا مواجه شد.")
	}

	return drivers, nil
}

func (s *DriverService) UpdateDriver(ctx context.Context, driverId int64, req models.UpdateDriverReq) (models.DriverDetails, error) {
	if driverId <= 0 {
		return models.DriverDetails{}, apperr.New(apperr.Invalid, "خطا: شناسه وارد شده صحیح نیست.")
	}

	driver, err := s.driverRepo.Update(ctx, driverId, req)
	if err != nil {
		return models.DriverDetails{}, apperr.New(apperr.Internal, apperr.Message(err))
	}

	return driver, nil
}

func (s *DriverService) DeleteDriver(ctx context.Context, driverId int64) error {
	if driverId <= 0 {
		return apperr.New(apperr.Invalid, "خطا: شناسه وارد شده صحیح نیست.")
	}

	err := s.driverRepo.Delete(ctx, driverId)
	if err != nil {
		log.Println("DELETE ERR: ", err.Error())
		return apperr.New(apperr.Internal, "خطا: حذف راننده با خطا مواجه شد.")
	}

	return nil
}
