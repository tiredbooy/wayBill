package middlewares

import (
	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func Recovery(log *zap.Logger) func(c *gin.Context) {
	return ginzap.RecoveryWithZap(log, true)
}
