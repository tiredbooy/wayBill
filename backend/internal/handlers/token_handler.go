package handlers

import (
	"net/http"
	"waybill/backend/internal/apperr"
	"waybill/backend/internal/services"

	"github.com/gin-gonic/gin"
)

func GetAuthToken(c *gin.Context) {
	token, err := services.GetValidationToken(c.Request.Context())
	if err != nil {
		c.JSON(apperr.HTTPStatus(err), apperr.Message(err))
		return
	}

	secure := gin.Mode() == gin.ReleaseMode

	c.SetCookie("X-Waybill-Token", token, 60 * 60 * 24 * 7, "/", "", secure, true)
	c.JSON(http.StatusOK, gin.H{"token": token})
}