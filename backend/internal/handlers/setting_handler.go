package handlers

import (
	"net/http"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
	"waybill/backend/internal/services"

	"github.com/gin-gonic/gin"
)

type SettingHandler struct {
	settingService *services.SettingService
}

func NewSettingHandler(settingService *services.SettingService) *SettingHandler {
	return &SettingHandler{
		settingService: settingService,
	}
}

func (h *SettingHandler) CreateSettings(c *gin.Context) {
	var req models.SettingReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	err := h.settingService.CreateSetting(c.Request.Context(), req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "تنظیمات با موفقیت ایجاد شد"})
}

func (h *SettingHandler) GetSettings(c *gin.Context) {
	setting, err := h.settingService.GetSetting(c.Request.Context())
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, setting)
}

func (h *SettingHandler) UpdateSettings(c *gin.Context) {
	var req models.SettingReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	updated, err := h.settingService.UpdateSetting(c.Request.Context(), req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, updated)
}
