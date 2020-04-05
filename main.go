package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/sajicode/go-book/logger"
)

// * intialize logger
var slogger = logger.NewLogger()

func init() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		slogger.ServerError("No env variable found")
	}
}

func main() {
	r := mux.NewRouter()

	// Non-existent pages
	r.NotFoundHandler = http.HandlerFunc(notFound)
	r.HandleFunc("/", hello).Methods("GET")

	appPort := fmt.Sprintf(":%s", os.Getenv("APP_PORT"))
	fmt.Println("Starting Server on PORT " + appPort)

	http.ListenAndServe(appPort, r)
}

func hello(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	fmt.Fprintln(w, "Hello Fellas")
}

func notFound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	w.WriteHeader(http.StatusNotFound)
	slogger.ServerError("Page does not exist")
	fmt.Fprint(w, "Sorry, we couldn't get the page you requested")
}