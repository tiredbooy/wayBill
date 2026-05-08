package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/csv"
	"waybill/backend/internal/models"
	"waybill/backend/internal/services"
	"waybill/backend/internal/utils"

	"github.com/gin-gonic/gin"
)

type WaybillHandler struct {
	waybillService services.WaybillService
}

func NewWaybillHandler(waybillService *services.WaybillService) *WaybillHandler {
	return &WaybillHandler{
		waybillService: *waybillService,
	}
}

func (h *WaybillHandler) CreateWaybill(c *gin.Context) {
	var req models.CreateWaybillReq

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Println("ERROR: ", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	err := h.waybillService.CreateWaybill(c.Request.Context(), req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": apperr.Message(err)})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "بارنامه با موفقیت ساخته شد"})
}

func (h *WaybillHandler) GetWaybill(c *gin.Context) {
	waybillID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No Waybill Id Provided."})
		return
	}

	waybill, err := h.waybillService.GetWaybillByID(c.Request.Context(), waybillID)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), gin.H{"error": apperr.Message(err)})
		return
	}

	c.JSON(http.StatusOK, waybill)
}

func (h *WaybillHandler) GetWaybills(c *gin.Context) {

	filters := models.WaybillFilters{
		Page:          int64(utils.ParseIntOrDefault(c.Query("page"), 1)),
		Limit:         int64(utils.ParseIntOrDefault(c.Query("limit"), 12)),
		CustomerID:    c.Query("customer"),
		WaybillNumber: c.Query("waybill-num"),
		PaymentStatus: c.Query("payment"),
		Amount:        c.Query("waybill-num"),
		Status:        c.Query("status"),
		Search:        c.Query("q"),
		SortBy:        c.Query("sortBy"),
		OrderBy:       c.Query("orderBy"),
	}

	if from := c.Query("from"); from != "" {
		if t, err := time.Parse("2006-01-02", from); err != nil {
			filters.From = &t
		}
	}

	if to := c.Query("to"); to != "" {
		if t, err := time.Parse("2006-01-02", to); err != nil {
			filters.To = &t
		}
	}

	waybills, err := h.waybillService.GetAllWaybills(c.Request.Context(), filters)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, waybills)
}

func (h *WaybillHandler) UpdateWaybill(c *gin.Context) {
	waybillID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "لطفا شناسه معتبر وارد نمایید."})
		return
	}

	var req models.UpdateWaybillReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "خطا: داده‌های ورودی نامعتبر است."})
		return
	}

	err = h.waybillService.UpdateWybill(c.Request.Context(), waybillID, req)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "وسیله نقلیه با موفقیت ویرایش شد."})
}

func (h *WaybillHandler) DeleteWaybill(c *gin.Context) {
	waybillID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "لطفا شناسه معتبر وارد نمایید."})
		return
	}

	err = h.waybillService.DeleteWaybill(c.Request.Context(), waybillID)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "بارنامه با موفقیت حذف شد."})
}



func (h *WaybillHandler) ExportWaybillsCSV(c *gin.Context) {
	var q models.WaybillFilters
	if err := c.ShouldBindQuery(&q); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "پارامترهای فیلتر نامعتبر است"})
		return
	}

	if fromStr := c.Query("from"); fromStr != "" {
		t, err := time.Parse("2006-01-02", fromStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "فرمت تاریخ 'از' نامعتبر است"})
			return
		}
		q.From = &t
	}

	if toStr := c.Query("to"); toStr != "" {
		t, err := time.Parse("2006-01-02", toStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "فرمت تاریخ 'تا' نامعتبر است"})
			return
		}
		q.To = &t
	}

	waybills, err := h.waybillService.GetAllWaybills(c.Request.Context(), q)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	headers := []string{
		"شماره بارنامه",
		"تاریخ",
		"وضعیت",
		"فرستنده",
		"گیرنده",
		"راننده",
		"مبدا",
		"مقصد",
		"وزن کل",
		"مبلغ کل",
		"بیمه",
		"وضعیت پرداخت",
	}

	rows := make([][]string, 0, len(waybills.Results))
	for _, wb := range waybills.Results {
		rows = append(rows, services.WaybillResponseToCSVRow(wb))
	}

	if err := csv.WriteCSV(c.Writer, "waybills", headers, rows); err != nil {
		log.Println("CSV write error:", err)
	}
}

func (h *WaybillHandler) ExportWaybillDetailCSV(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "شناسه بارنامه نامعتبر است"})
		return
	}

	wb, err := h.waybillService.GetWaybillByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	headers := []string{
		"شماره بارنامه",
		"تاریخ صدور",
		"تاریخ اعزام",
		"تاریخ تحویل مورد انتظار",
		"تاریخ تحویل واقعی",
		"وضعیت",
		"فرستنده",
		"کد فرستنده",
		"موبایل فرستنده",
		"تلفن فرستنده",
		"گیرنده",
		"کد گیرنده",
		"موبایل گیرنده",
		"تلفن گیرنده",
		"راننده",
		"کد راننده",
		"موبایل راننده",
		"گواهینامه",
		"کد ملی راننده",
		"وسیله نقلیه",
		"کد وسیله",
		"پلاک",
		"مبدا",
		"کد مبدا",
		"مقصد",
		"کد مقصد",
		"وزن کل",
		"تعداد بسته",
		"شرح کالا",
		"کرایه",
		"بیمه دارد",
		"مبلغ بیمه",
		"سایر هزینه‌ها",
		"مبلغ کل",
		"وضعیت پرداخت",
		"یادداشت",
		"تاریخ ایجاد",
		"تاریخ بروزرسانی",
	}

	rows := [][]string{services.WaybillDetailToCSVRow(wb)}

	if err := csv.WriteCSV(c.Writer, fmt.Sprintf("waybill_%d", id), headers, rows); err != nil {
		log.Println("CSV write error:", err)
	}
}