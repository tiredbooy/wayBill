package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"waybill/backend/internal/apperr"
	"waybill/backend/internal/models"
	"waybill/backend/internal/services"
)

type AnalyticsHandler struct {
	analyticsService *services.AnalyticsService
}

func NewAnalyticsHandler(analyticsService *services.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{
		analyticsService: analyticsService,
	}
}

func (h *AnalyticsHandler) GetAnalyticsSummary(c *gin.Context) {
	period := c.DefaultQuery("period", "7d")
	filter := models.AnalyticFilters{Period: period}

	summary, err := h.analyticsService.GetAnalyticsSummary(c.Request.Context(), filter)
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	c.JSON(http.StatusOK, summary)
}
