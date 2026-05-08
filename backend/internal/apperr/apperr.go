package apperr

import (
	"errors"
	"fmt"
	"net/http"
)

type Kind string

const (
	Invalid   Kind = "invalid"   // bad input, validation
	NotFound  Kind = "not_found" // resource not found
	Conflict  Kind = "conflict"  // already exists / unique violation
	Forbidden Kind = "forbidden" // not allowed
	Unauth    Kind = "unauthorized"
	Internal  Kind = "internal" // unexpected error
	OK        Kind = "ok"
)

type Error struct {
	Kind Kind
	Msg  string
	Err  error
}

func (e *Error) Error() string {
	if e == nil {
		return ""
	}

	return e.Msg
}

// Unwrap allows errors.Is / errors.As to work through this error.
func (e *Error) Unwrap() error {
	return e.Err
}

func New(kind Kind, msg string) *Error {
	return &Error{Kind: kind, Msg: msg}
}

func Wrap(kind Kind, msg string, err error) *Error {
	return &Error{Kind: kind, Msg: msg, Err: err}
}

func isKind(err error, kind Kind) bool {
	var ae *Error
	if errors.As(err, &ae) {
		return ae.Kind == kind
	}
	return false
}

func HTTPStatus(err error) int {
	var ae *Error
	if errors.As(err, &ae) {
		switch ae.Kind {
		case Invalid:
			return http.StatusBadRequest
		case Unauth:
			return http.StatusUnauthorized
		case Forbidden:
			return http.StatusForbidden
		case NotFound:
			return http.StatusNotFound
		case Conflict:
			return http.StatusConflict
		case OK:
			return http.StatusOK
		default:
			return http.StatusInternalServerError
		}
	}
	return http.StatusInternalServerError
}

// Message Returns a safe message for the client.
// if its not an apperr, return a generic message

func Message(err error) string {
	var ae *Error
	if errors.As(err, &ae) && ae.Msg != "" {
		return ae.Msg
	}
	return "خطای داخلی سرور"
}

// For logging (optional): keep details without leaking to client
func Debug(err error) string {
	var ae *Error
	if errors.As(err, &ae) && ae.Err != nil {
		return fmt.Sprintf("%s: %v", ae.Msg, ae.Err)
	}
	if err == nil {
		return ""
	}
	return err.Error()
}
