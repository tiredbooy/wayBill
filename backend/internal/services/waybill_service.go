package services

import (
	"context"
	"fmt"
	"log"
	"strings"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
	"waybill/backend/internal/repositories"
	"waybill/backend/internal/utils"

	"github.com/google/uuid"
)

type WaybillService struct {
	waybillRepo  repositories.WaybillRepository
	driverRepo   repositories.DriverRepository
	vehicleRepo  repositories.VehicleRepository
	locationRepo repositories.LocationRepository
}

func NewWaybillService(waybillRepo repositories.WaybillRepository, driverRepo repositories.DriverRepository, vehicleRepo repositories.VehicleRepository, locationRepo repositories.LocationRepository) *WaybillService {
	return &WaybillService{waybillRepo: waybillRepo, driverRepo: driverRepo, vehicleRepo: vehicleRepo, locationRepo: locationRepo}
}

func (s *WaybillService) CreateWaybill(ctx context.Context, req models.CreateWaybillReq) error {

	if req.WaybillNumber == nil || *req.WaybillNumber == "" {
		waybillNum, err := uuid.NewRandom()
		if err != nil {
			log.Println("Failed to generate uuid for waybill")
		}
		*req.WaybillNumber = waybillNum.String()
	}

	if !*req.HaveInsurance && *req.InsuranceAmount > 0 {
		*req.HaveInsurance = true
	}

	if req.SenderID <= 0 {
		return apperr.New(apperr.Invalid, "خطا: لطفا شناسه معتبر برای فرستنده وارد نمایید")
	}

	if req.ReceiverID <= 0 {
		return apperr.New(apperr.Invalid, "خطا: لطفا شناسه معتبر برای دریافت کننده وارد نمایید")
	}

	vehicleExists, err := s.vehicleRepo.ExistsByID(ctx, req.VehicleID)
	if err != nil {
		return apperr.Wrap(apperr.Internal, "خطا: بررسی وسیله نقلیه با خطا مواجه شد.", err)
	}

	if !vehicleExists {
		return apperr.New(apperr.Invalid, "خطا: وسیله نقلیه مورد نظر وجود ندارد")
	}

	driverExists, err := s.driverRepo.ExistsByID(ctx, req.DriverID)
	if err != nil {
		return apperr.Wrap(apperr.Internal, "خطا: بررسی راننده با خطا مواجه شد.", err)
	}
	if !driverExists {
		return apperr.New(apperr.Invalid, "خطا: راننده مورد نظر وجود ندارد")
	}

	originLocationExists, err := s.locationRepo.ExistsByID(ctx, req.OriginLocationID)
	if err != nil {
		return apperr.Wrap(apperr.Internal, "خطا: بررسی مکان با خطا مواجه شد.", err)
	}

	destinationLocationExists, err := s.locationRepo.ExistsByID(ctx, req.DestinationLocationID)
	if err != nil {
		return apperr.Wrap(apperr.Internal, "خطا: بررسی مکان با خطا مواجه شد.", err)
	}

	if !originLocationExists || !destinationLocationExists {
		return apperr.New(apperr.Invalid, "خطا: مکان مورد نظر وجود ندارد")
	}

	if *req.Status == "" {
		*req.Status = "pending"
	}

	err = s.waybillRepo.Create(ctx, req)
	if err != nil {
		log.Println("ERRR: ", err.Error())
		return apperr.New(apperr.Internal, "هنگام ساخت بارنامه خطایی رخ داد")
	}

	return nil
}

func (s *WaybillService) GetAllWaybills(ctx context.Context, q models.WaybillFilters) (models.Page[models.WaybillResponse], error) {
	if q.Page <= 0 {
		q.Page = 1
	}

	if q.Limit <= 0 || q.Limit > 100 {
		q.Limit = 20
	}

	q.Search = strings.TrimSpace(q.Search)

	waybills, err := s.waybillRepo.GetAllWaybills(ctx, q)
	if err != nil {
		log.Println("err", err.Error())
		return models.Page[models.WaybillResponse]{}, apperr.New(apperr.Internal, "خطا: دریافت بارنامه ها با خطا مواجه شد.")
	}

	return waybills, nil
}

func (s *WaybillService) GetWaybillByID(ctx context.Context, waybillID int64) (models.WaybillDetail, error) {
	if waybillID <= 0 {
		return models.WaybillDetail{}, apperr.New(apperr.Invalid, "خطا: شناسه وارد شده صحیح نیست.")
	}

	waybill, err := s.waybillRepo.GetWaybillByID(ctx, waybillID)

	if err != nil {
		log.Println("ERR: ", err.Error())
		return models.WaybillDetail{}, apperr.New(apperr.Internal, "خطا: دریافت اطلاعات بارنامه با خطا مواجه شد.")
	}

	return waybill, nil
}

func (s *WaybillService) UpdateWybill(ctx context.Context, waybillID int64, req models.UpdateWaybillReq) error {
	if waybillID <= 0 {
		return apperr.New(apperr.Invalid, "خطا: شناسه وسیله نقلیه نامعتبر است.")
	}

	err := s.waybillRepo.Update(ctx, waybillID, req)
	if err != nil {
		return apperr.New(apperr.Internal, "خطا: ویرایش بارنامه با خطا مواجه شد.")
	}

	return nil
}

func (s *WaybillService) DeleteWaybill(ctx context.Context, waybillID int64) error {
	if waybillID <= 0 {
		return apperr.New(apperr.Invalid, "خطا: شناسه بارنامه نامعتبر است.")
	}

	err := s.waybillRepo.Delete(ctx, waybillID)
	if err != nil {
		return apperr.New(apperr.Internal, "خطا: حذف بارنامه با خطا مواجه شد.")
	}

	return nil
}

func WaybillResponseToCSVRow(wb models.WaybillResponse) []string {
	return []string{
		wb.WaybillNumber,
		wb.CreatedAt.Format("2006-01-02"),
		wb.Sender,
		wb.Receiver,
		wb.Driver,
		wb.OriginLocation,
		wb.DestinationLocation,
		utils.Nfloat(wb.TotalWeight),
		utils.Nfloat(wb.TotalAmount),
		fmt.Sprintf("%v", wb.HaveInsurance),
	}
}

func WaybillDetailToCSVRow(wb models.WaybillDetail) []string {
	return []string{
		wb.WaybillNumber,
		wb.IssueDate.Format("2006-01-02"),
		wb.DispatchDate.Format("2006-01-02"),
		utils.StrPtr(wb.ExpectedDeliveryDate),
		utils.Ntime(wb.ActualDeliveryDate),
		utils.StrPtr(wb.Status),
		wb.Sender,
		fmt.Sprintf("%d", wb.SenderID),
		wb.SenderPhoneMobile,
		wb.SenderPhoneFixed,
		wb.Receiver,
		fmt.Sprintf("%d", wb.ReceiverID),
		wb.ReceiverPhoneMobile,
		wb.ReceiverPhoneFixed,
		wb.Driver,
		fmt.Sprintf("%d", wb.DriverID),
		wb.DriverPhoneNum,
		wb.DriverLicenseNum,
		wb.DriverNationalCode,
		wb.Vehicle,
		fmt.Sprintf("%d", wb.VehicleID),
		wb.VehiclePlate,
		wb.OriginLocation,
		fmt.Sprintf("%d", wb.OriginLocationID),
		wb.DestinationLocation,
		fmt.Sprintf("%d", wb.DestinationLocationID),
		utils.Nfloat(wb.TotalWeight),
		utils.Nint(wb.TotalPackages),
		utils.StrPtr(wb.Desription),
		fmt.Sprintf("%.2f", wb.FreightCharge),
		fmt.Sprintf("%v", wb.HaveInsurance),
		utils.Nfloat(wb.InsuranceAmount),
		utils.Nfloat(wb.OtherCharges),
		utils.Nfloat(wb.TotalAmount),
		utils.StrPtr(wb.PaymentStatus),
		utils.StrPtr(wb.Notes),
		wb.CreatedAt.Format("2006-01-02 15:04:05"),
		wb.UpdatedAt.Format("2006-01-02 15:04:05"),
	}
}
