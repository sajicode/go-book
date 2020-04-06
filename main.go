package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/sajicode/go-book/logger"
	"github.com/sajicode/go-book/models"
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

	// Get environment variables
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	dbDriver := os.Getenv("DB_DRIVER")

	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	services, err := models.NewServices(dbDriver, psqlInfo)
	must(err)
	defer services.Close()

	//! to clear db
	// services.DestructiveReset()

	services.AutoMigrate()

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

func must(err error) {
	if err != nil {
		panic(err)
	}
}