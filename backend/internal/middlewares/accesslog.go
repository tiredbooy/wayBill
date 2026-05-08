package middlewares

import (
	"github.com/gin-contrib/requestid"
	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func AccessLog(log *zap.Logger, timeFormat string) gin.HandlerFunc {
	return ginzap.GinzapWithConfig(log, &ginzap.Config{
		TimeFormat: timeFormat,
		UTC:        true,
		Context: ginzap.Fn(func(c *gin.Context) []zapcore.Field {
			return []zapcore.Field{
				zap.String("request_id", requestid.Get(c)),
			}
		}),
	})
}
