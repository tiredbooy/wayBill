package services

import (
	"context"
	"log"
	"time"

	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
	"waybill/backend/internal/repositories"
)

type AnalyticsService struct {
	analyticsRepo repositories.AnalyticsRepository
	settingRepo   repositories.SettingRepository
}

func NewAnalyticsService(
	analyticsRepo *repositories.AnalyticsRepository,
	settingRepo *repositories.SettingRepository,
) *AnalyticsService {
	return &AnalyticsService{
		analyticsRepo: *analyticsRepo,
		settingRepo:   *settingRepo,
	}
}

func (s *AnalyticsService) GetAnalyticsSummary(ctx context.Context, filter models.AnalyticFilters) (models.AnalyticsSummary, error) {
	startDate, endDate := s.resolveDateRange(filter)

	// 1. Get numeric aggregates
	summary, err := s.analyticsRepo.GetAnalyticsSummary(ctx, startDate, endDate)
	if err != nil {
		return summary, apperr.New(apperr.Internal, "خطا در دریافت آمار بارنامه‌ها")
	}

	// 2. Get top senders (top 5)
	topSenders, err := s.analyticsRepo.GetTopSenders(ctx, startDate, endDate, 5)
	if err != nil {
		log.Println("ERROR: ", err.Error())
		summary.TopSenders = nil
	} else {
		summary.TopSenders = topSenders
	}

	// 3. Fetch commission rate from settings
	setting, err := s.settingRepo.Get(ctx)
	if err != nil {
		return summary, apperr.New(apperr.Internal, "خطا در دریافت تنظیمات")
	}

	rate := 0.0
	if setting.CommissionRate != nil {
		rate = *setting.CommissionRate
	}
	summary.CommissionRate = rate
	summary.Revenue = (summary.TotalAmount * rate) / 100.0

	return summary, nil
}

func (s *AnalyticsService) resolveDateRange(filter models.AnalyticFilters) (time.Time, time.Time) {
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	switch filter.Period {
	case "7d":
		return today.AddDate(0, 0, -7), now
	case "30d":
		return today.AddDate(0, 0, -30), now
	case "this_month":
		firstOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
		return firstOfMonth, now
	case "last_month":
		firstOfThisMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
		firstOfLastMonth := firstOfThisMonth.AddDate(0, -1, 0)
		lastOfLastMonth := firstOfThisMonth.Add(-time.Second)
		return firstOfLastMonth, lastOfLastMonth
	case "custom":
		return filter.StartDate, filter.EndDate
	default:
		// all time
		return time.Time{}, time.Time{}
	}
}
