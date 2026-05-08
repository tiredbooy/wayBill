package middlewares

import (
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"

	"waybill/backend/internal/licensing"

	"github.com/gin-gonic/gin"
)

func LocalTokenRequired() gin.HandlerFunc {
	var (
		tokenOnce sync.Once
		tokenVal  string
		tokenErr  error
	)

	// Load once on first middleware creation (fast, stable)
	tokenOnce.Do(func() {
		tokenVal, tokenErr = licensing.GetOrCreateLocalToken()
	})

	return func(c *gin.Context) {
		// Always allow preflight or CORS will break
		if c.Request.Method == http.MethodOptions {
			c.Next()
			return
		}

		if tokenErr != nil || tokenVal == "" {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error": "license token unavailable",
			})
			return
		}

		got := c.GetHeader("X-Waybill-Token")
		if got == "" {
			// optional: allow Authorization: Bearer <token>
			auth := c.GetHeader("Authorization")
			if auth != "" {
				if strings.HasPrefix(auth, "Bearer ") {
					got = strings.TrimPrefix(auth, "Bearer ")
				}
			} else {
				tok, _ := c.Request.Cookie("X-Waybill-Token")
				decodedToken, err := url.QueryUnescape(tok.Value)
				if err != nil {
					log.Printf("Failed to decode token from cookie: %v", err)
					c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
					return
				}

				got = decodedToken
			}
		}

		if got != tokenVal {
			log.Println("tokenVal: ", tokenVal)
			log.Println("GOT: ", got)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "unauthorized",
			})
			return
		}

		c.Next()
	}
}
