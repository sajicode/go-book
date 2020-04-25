package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/sajicode/go-book/controllers"
	"github.com/sajicode/go-book/email"
	"github.com/sajicode/go-book/logger"
	"github.com/sajicode/go-book/middleware"
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
	mgDomain := os.Getenv("MG_DOMAIN")
	mgAPIKey := os.Getenv("MG_API_KEY")
	mgPublicKey := os.Getenv("MG_PUBLIC_KEY")

	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	services, err := models.NewServices(dbDriver, psqlInfo)
	must(err)
	defer services.Close()

	//! to clear db
	// services.DestructiveReset()

	services.AutoMigrate()

	// use emailer
	emailer := email.NewClient(
		email.WithSender("Literary Support", "support@literaryreviews.co"),
		email.WithMailgun(mgDomain, mgAPIKey, mgPublicKey),
	)

	// mock usage to prevent errors
	// _ = emailer

	r := mux.NewRouter()

	usersController := controllers.NewUsers(services.User, *emailer)
	booksController := controllers.NewBooks(services.Book)
	reviewsController := controllers.NewReviews(services.Review, services.Book)

	// auth middleware
	userMw := middleware.User{
		UserService: services.User,
	}

	// Non-existent pages
	// r.NotFoundHandler = http.HandlerFunc(notFound)

	api := r.PathPrefix("/api/").Subrouter()

	// index page
	api.HandleFunc("/", hello).Methods("GET")

	// user routes
	api.HandleFunc("/users/signup", usersController.Create).Methods("POST")
	api.HandleFunc("/users/login", usersController.Login).Methods("POST")
	api.HandleFunc("/users/update/{id:[0-9]+}", userMw.ApplyFn(usersController.Update)).Methods("POST")
	api.HandleFunc("/users/{id:[0-9]+}", userMw.ApplyFn(usersController.GetUser)).Methods("GET")
	api.HandleFunc("/users/info", userMw.ApplyFn(usersController.UserByHash)).Methods("GET")
	api.HandleFunc("/users/forgot", usersController.InitiateReset).Methods("POST")
	api.HandleFunc("/users/reset", usersController.CompleteReset).Methods("POST")

	// book routes
	api.HandleFunc("/books/new", userMw.ApplyFn(booksController.Create)).Methods("POST")
	api.HandleFunc("/books", booksController.GetAllBooks).Methods("GET")
	api.HandleFunc("/books/me", userMw.ApplyFn(booksController.ShowUserBooks)).Methods("GET")
	api.HandleFunc("/books/{id:[0-9]+}", userMw.ApplyFn(booksController.GetOneBook)).Methods("GET")
	api.HandleFunc("/books/update/{id:[0-9]+}", userMw.ApplyFn(booksController.Update)).Methods("POST")

	// review routes
	api.HandleFunc("/books/{id:[0-9]+}/review", userMw.ApplyFn(reviewsController.Create)).Methods("POST")
	api.HandleFunc("/books/{id:[0-9]+}/reviews", userMw.ApplyFn(reviewsController.GetBookReviews)).Methods("GET")

	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./client/build/static/"))))

	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./client/build/index.html")
	})

	appPort := fmt.Sprintf(":%s", os.Getenv("PORT"))
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
