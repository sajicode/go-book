package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func init() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print(err)
	}
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/", hello).Methods("GET")

	appPort := fmt.Sprintf(":%s", os.Getenv("APP_PORT"))
	fmt.Println("Starting Server on PORT " + appPort)

	http.ListenAndServe(appPort, r)
}

func hello(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	fmt.Fprintln(w, "Hello Fellas")
}