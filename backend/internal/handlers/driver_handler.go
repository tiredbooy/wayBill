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

type DriverHandler struct {
	driverService services.DriverService
}

func NewDriverHandler(driverService *services.DriverService) *DriverHandler {
	return &DriverHandler{
		driverService: *driverService,
	}
}

func (h *DriverHandler) CreateDriver(c *gin.Context) {
	var req models.CreateDriverReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	err := h.driverService.CreateDriver(c.Request.Context(), req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": gin.H{"error": apperr.Message(err)}})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "راننده با موفقیت ساخته شد."})
}

func (h *DriverHandler) GetDriver(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No Vehicle Id Provided."})
		return
	}

	driver, err := h.driverService.GetDriver(c.Request.Context(), int64(id))
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": apperr.Message(err)})
		return
	}

	c.JSON(http.StatusOK, driver)
}

func (h *DriverHandler) GetDrivers(c *gin.Context) {
	filters := models.DriverFilters{
		Page:    int64(utils.ParseIntOrDefault(c.Query("page"), 1)),
		Limit:   int64(utils.ParseIntOrDefault(c.Query("limit"), 12)),
		Status:  c.Query("status"),
		Search:  c.Query("q"),
		SortBy:  c.Query("sortBy"),
		OrderBy: c.Query("orderBy"),
	}

	drivers, err := h.driverService.GetDrivers(c.Request.Context(), filters)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": apperr.Message(err)})
		return
	}

	c.JSON(http.StatusOK, drivers)
}

func (h *DriverHandler) UpdateDriver(c *gin.Context) {
	driverId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "لطفا شناسه معتبر وارد نمایید."})
		return
	}

	var req models.UpdateDriverReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	driver, err := h.driverService.UpdateDriver(c.Request.Context(), driverId, req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": apperr.Message(err)})
		return
	}

	c.JSON(http.StatusOK, driver)
}

func (h *DriverHandler) DeleteDriver(c *gin.Context) {
	driverId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "لطفا شناسه معتبر وارد نمایید."})
		return
	}

	err = h.driverService.DeleteDriver(c.Request.Context(), driverId)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": apperr.Message(err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "راننده با موفقیت حذف شد."})
}
