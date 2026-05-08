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

type CustomerHandler struct {
	customerService services.CustomerService
}

func NewCustomerHandler(customerService *services.CustomerService) *CustomerHandler {
	return &CustomerHandler{
		customerService: *customerService,
	}
}

func (h *CustomerHandler) CreateCustomer(c *gin.Context) {
	var req models.CreateCustomerReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	err := h.customerService.CreateCustomer(c.Request.Context(), req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "مشتری با موفقیت ساخته شد"})
}

func (h *CustomerHandler) GetCustomers(c *gin.Context) {

	filters := models.CustomerFilters{
		Page:    int64(utils.ParseIntOrDefault(c.Query("page"), 1)),
		Limit:   int64(utils.ParseIntOrDefault(c.Query("limit"), 12)),
		Search:  c.Query("q"),
		SortBy:  c.Query("sortBy"),
		OrderBy: c.Query("orderBy"),
	}

	customers, err := h.customerService.GetCustomers(c.Request.Context(), filters)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, customers)
}

func (h *CustomerHandler) GetCustomer(c *gin.Context) {
	customerID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: لطفا شناسه معتبر وارد نمایید."})
		return
	}

	customer, err := h.customerService.GetCustomer(c.Request.Context(), customerID)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": apperr.Message(err)})
		return
	}

	c.JSON(http.StatusOK, customer)
}

func (h *CustomerHandler) UpdateCustomer(c *gin.Context) {
	customerID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "لطفا شناسه معتبر وارد نمایید."})
		return
	}

	var req models.UpdateCustomerReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	customer, err := h.customerService.UpdateCustomer(c.Request.Context(), customerID, req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, customer)
}

func (h *CustomerHandler) DeleteCustomer(c *gin.Context) {
	customerID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "لطفا شناسه معتبر وارد نمایید."})
		return
	}

	err = h.customerService.DeleteCustomer(c.Request.Context(), customerID)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "مشتری با موفقیت حذف شد."})
}
