package middlewares

import (
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type Deps struct {
	Log *zap.Logger
	// Add config fields you need (allowed origins, dev flags, etc.)
	AllowedOrigins []string
	EnableGzip     bool
}

func ApplyGlobal(r *gin.Engine, d Deps) {
	// request id first so every log line can include it
	r.Use(RequestID())

	// cors before routes so OPTIONS preflight works
	r.Use(CORS(d.AllowedOrigins))

	// optional gzip
	if d.EnableGzip {
		r.Use(Gzip(1024))
	}

	// access log + recovery with zap
	if d.Log != nil {
		r.Use(AccessLog(d.Log, time.RFC3339))
		r.Use(Recovery(d.Log))
	} else {
		// fallback
		r.Use(gin.Logger())
		r.Use(gin.Recovery())
	}

	// safe defaults
	r.Use(LimitBody(10 << 20)) // 10MB, tweak
}
