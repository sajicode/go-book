package utils

import (
	"encoding/json"
	"net/http"
)

// Fail returns a formatted error response to the client
func Fail(status string, message string) map[string]interface{} {
	return map[string]interface{}{"status": status, "message": message}
}

// Message returns a formatted success response to the client
func Success(status string, data interface{}) map[string]interface{} {
	return map[string]interface{}{"status": status, "data": data}
}

// Respond returns a formatted http response to the client
func Respond(w http.ResponseWriter, data interface{}) {
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
