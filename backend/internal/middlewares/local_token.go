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

    tokenOnce.Do(func() {
        tokenVal, tokenErr = licensing.GetOrCreateLocalToken()
    })

    return func(c *gin.Context) {
        // Allow preflight
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
            // Check Authorization header
            auth := c.GetHeader("Authorization")
            if auth != "" && strings.HasPrefix(auth, "Bearer ") {
                got = strings.TrimPrefix(auth, "Bearer ")
            }
        }

        // If still empty, try cookie
        if got == "" {
            tok, err := c.Request.Cookie("X-Waybill-Token")
            if err == nil && tok != nil {
                decoded, decErr := url.QueryUnescape(tok.Value)
                if decErr == nil {
                    got = decoded
                }
            }
        }

        // Final check
        if got == "" || got != tokenVal {
            log.Printf("tokenVal: %q, received: %q\n", tokenVal, got)
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
            return
        }

        c.Next()
    }
}