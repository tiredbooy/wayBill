package middlewares

import (
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

func Gzip(minLen int) gin.HandlerFunc {
	return gzip.Gzip(
		gzip.DefaultCompression,
		// gzip.WithMinLength(minLen),
	)
}
