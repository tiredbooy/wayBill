package handlers

import (
	"net/http"
	"strconv"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
	"waybill/backend/internal/services"
	"waybill/backend/internal/utils"

	"github.com/gin-gonic/gin"
)

type VehicleHandler struct {
	vehicleService services.VehicleService
}

func NewVehicleHandler(vehicleService *services.VehicleService) *VehicleHandler {
	return &VehicleHandler{
		vehicleService: *vehicleService,
	}
}

func (v *VehicleHandler) CreateVehicle(c *gin.Context) {
	var req models.Vehicle

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	err := v.vehicleService.CreateVehicle(c.Request.Context(), req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": gin.H{"error": apperr.Message(err)}})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "وسیله نقلیه با موفقیت ساخته شد"})
}

func (v *VehicleHandler) GetVehicle(c *gin.Context) {
	vehicleId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No Vehicle Id Provided."})
		return
	}

	vehicle, err := v.vehicleService.GetVehicleByID(c.Request.Context(), vehicleId)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": gin.H{"error": apperr.Message(err)}})
		return
	}

	c.JSON(http.StatusOK, vehicle)
}

func (v *VehicleHandler) GetVehicles(c *gin.Context) {

	filters := models.VehicleFilters{
		Page:    int64(utils.ParseIntOrDefault(c.Query("page"), 1)),
		Limit:   int64(utils.ParseIntOrDefault(c.Query("limit"), 12)),
		Status:  c.Query("status"),
		Search:  c.Query("q"),
		SortBy:  c.Query("sortBy"),
		OrderBy: c.Query("orderBy"),
	}

	vehicles, err := v.vehicleService.GetAllVehicles(c.Request.Context(), filters)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": apperr.Message(err)})
		return
	}

	c.JSON(http.StatusOK, vehicles)
}

func (v *VehicleHandler) UpdateVehicle(c *gin.Context) {
	vehicleId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "لطفا شناسه معتبر وارد نمایید."})
		return
	}

	var req models.UpdateVehicleReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	vehicle, err := v.vehicleService.UpdateVehicle(c.Request.Context(), vehicleId, req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": apperr.Message(err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "وسیله نقلیه با موفقیت ویرایش شد.", "data": vehicle})
}

func (v *VehicleHandler) DeleteVehicle(c *gin.Context) {
	vehicleId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "لطفا شناسه معتبر وارد نمایید."})
		return
	}

	err = v.vehicleService.DeleteVehicle(c.Request.Context(), vehicleId)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": apperr.Message(err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "وسیله ی نقلیه با موفقیت حذف شد."})
}
