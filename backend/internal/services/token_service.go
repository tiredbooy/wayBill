package services

import (
	"context"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/licensing"
)



func GetValidationToken(ctx context.Context) (string, error) {
	tokenVal, err := licensing.GetOrCreateLocalToken()
	if err != nil {
		apperr.New(apperr.Internal, "خطا: هنگام دریافت توکن خطایی رخ داد.")
	}

	if tokenVal == "" || len(tokenVal) <= 0 {
		apperr.New(apperr.Internal, "خطا: توکن معتبر نمیباشد.")
	}

	return tokenVal, nil
}