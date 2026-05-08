package services

import (
	"context"
	"log"
	"strings"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
	"waybill/backend/internal/repositories"
)

type CustomerService struct {
	customerRepo repositories.CustomerRepository
}

func NewCustomerService(customerRepo repositories.CustomerRepository) *CustomerService {
	return &CustomerService{customerRepo: customerRepo}
}

func (s *CustomerService) CreateCustomer(ctx context.Context, req models.CreateCustomerReq) error {
	req.Name = strings.TrimSpace(req.Name)

	err := s.customerRepo.Create(ctx, req)
	if err != nil {
		return apperr.New(apperr.Invalid, "هنگام ساخت خطایی رخ داد.")
	}

	return nil
}

func (s *CustomerService) GetCustomers(ctx context.Context, q models.CustomerFilters) (models.Page[models.Customer], error) {
	if q.Page <= 0 {
		q.Page = 1
	}

	if q.Limit <= 0 {
		q.Limit = 12
	} else if q.Limit > 100 {
		q.Limit = 100
	}

	if q.Search != "" {
		q.Search = strings.TrimSpace(q.Search)
	}

	customers, err := s.customerRepo.GetAllCustomers(ctx, q)
	if err != nil {
		log.Println("ERROR", err.Error())
		return models.Page[models.Customer]{}, apperr.New(apperr.Internal, "هنگام دریافت اطلاعات خطایی رخ داد.")
	}

	return customers, nil
}

func (s *CustomerService) GetCustomer(ctx context.Context, customerID int64) (models.Customer, error) {
	if customerID <= 0 {
		return models.Customer{}, apperr.New(apperr.Invalid, "خطا: لطفا یک شناسه صحیح وارد نمایید")
	}

	customer, err := s.customerRepo.GetCustomerByID(ctx, customerID)
	if err != nil {
		return models.Customer{}, apperr.New(apperr.Internal, "هنگام دریافت اطلاعات خطایی رخ داد.")
	}

	return customer, nil
}

func (s *CustomerService) UpdateCustomer(ctx context.Context, customerID int64, req models.UpdateCustomerReq) (models.Customer, error) {
	if customerID <= 0 {
		return models.Customer{}, apperr.New(apperr.Invalid, "خطا: لطفا یک شناسه صحیح وارد نمایید")
	}

	customer, err := s.customerRepo.Update(ctx, customerID, req)
	if err != nil {
		return models.Customer{}, apperr.New(apperr.Internal, "هنگام ویرایش خطایی رخ داد، لحظاتی دیگر امتحان نمایید")
	}

	return customer, nil
}

func (s *CustomerService) DeleteCustomer(ctx context.Context, customerID int64) error {
	if customerID <= 0 {
		return apperr.New(apperr.Invalid, "خطا: شناسه نامعتبر است.")
	}

	err := s.customerRepo.Delete(ctx, customerID)
	if err != nil {
		return apperr.New(apperr.Internal, "خطا: حذف با خطا مواجه شد.")
	}

	return nil
}
