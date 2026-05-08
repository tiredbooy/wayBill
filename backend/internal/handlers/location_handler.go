package handlers

import (
	"net/http"
	"strconv"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
	"waybill/backend/internal/services"

	"github.com/gin-gonic/gin"
)

type LocationHandler struct {
	locationService services.LocationService
}

func NewLocationHandler(locationService *services.LocationService) *LocationHandler {
	return &LocationHandler{
		locationService: *locationService,
	}
}

func (h *LocationHandler) CreateLocation(c *gin.Context) {
	var req models.LocationReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	err := h.locationService.CreateLocation(c.Request.Context(), req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "مکان با موفقیت ساخته شد"})
}

func (h *LocationHandler) GetLocations(c *gin.Context) {

	customers, err := h.locationService.GetLocations(c.Request.Context())
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, customers)
}

func (h *LocationHandler) GetLocation(c *gin.Context) {
	locationID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: لطفا شناسه معتبر وارد نمایید."})
		return
	}

	customer, err := h.locationService.GetLocation(c.Request.Context(), locationID)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": apperr.Message(err)})
		return
	}

	c.JSON(http.StatusOK, customer)
}

func (h *LocationHandler) UpdateLocation(c *gin.Context) {
	locationID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "لطفا شناسه معتبر وارد نمایید."})
		return
	}

	var req models.LocationReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	customer, err := h.locationService.UpdateLocation(c.Request.Context(), locationID, req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, customer)
}

func (h *LocationHandler) DeleteLocation(c *gin.Context) {
	locationID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "لطفا شناسه معتبر وارد نمایید."})
		return
	}

	err = h.locationService.DeleteLocation(c.Request.Context(), locationID)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "مکان با موفقیت حذف شد."})
}
