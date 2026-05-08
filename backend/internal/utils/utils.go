package utils

import (
	"fmt"
	"strconv"
	"time"
)

type NullableString struct {
	String string
	Valid  bool
}

func ParseIntOrDefault(s string, defaultVal int) int {
	if s == "" {
		return defaultVal
	}
	val, err := strconv.Atoi(s)
	if err != nil || val < 1 {
		return defaultVal
	}
	return val
}

func ParseFloatOrDefault(s string, defaultVal float64) float64 {
	if s == "" {
		return defaultVal
	}
	val, err := strconv.ParseFloat(s, 64)
	if err != nil || val < 0 {
		return defaultVal
	}
	return val
}

func Nstr(ns *NullableString) string {
	if ns == nil || !ns.Valid {
		return ""
	}
	return ns.String
}

func Nfloat(f *float64) string {
	if f == nil {
		return ""
	}
	return fmt.Sprintf("%.2f", *f)
}

func Nint(i *int64) string {
	if i == nil {
		return ""
	}
	return fmt.Sprintf("%d", *i)
}

func Ntime(t *time.Time) string {
	if t == nil {
		return ""
	}
	return t.Format("2006-01-02")
}

func StrPtr(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
