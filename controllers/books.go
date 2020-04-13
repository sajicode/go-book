package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/sajicode/go-book/context"
	"github.com/sajicode/go-book/models"
	util "github.com/sajicode/go-book/utils"
)

// Books controller structure
type Books struct {
	bs models.BookService
}

// NewBooks is used to create a new book controller
func NewBooks(bs models.BookService) *Books {
	return &Books{
		bs: bs,
	}
}

// Create a new book
// POST /books/new
func (b *Books) Create(w http.ResponseWriter, r *http.Request) {
	user := context.User(r.Context())

	book := &models.Book{}
	err := json.NewDecoder(r.Body).Decode(book)
	book.UserID = user.ID
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}

	newBook, err := b.bs.Create(book)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}
	util.Respond(w, util.Success("success", newBook))
}

// ShowUserBooks returns all books created by a user
// GET /books/me
func (b *Books) ShowUserBooks(w http.ResponseWriter, r *http.Request) {
	user := context.User(r.Context())
	books, err := b.bs.ByUserID(user.ID)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}
	util.Respond(w, util.Success("success", books))
}

// GetOneBook returns a single book by its ID
// GET/books/:id
func (b *Books) GetOneBook(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}
	book, err := b.bs.ByID(uint(id))
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}
	util.Respond(w, util.Success("success", book))
}

// Update a book's details
// POST/books/update/:id
func (b *Books) Update(w http.ResponseWriter, r *http.Request) {
	book, err := b.bookByID(w, r)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		return
	}
	user := context.User(r.Context())
	if user.ID != book.UserID {
		slogger.InvalidRequest("Unauthorized request")
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		util.Respond(w, util.Fail("fail", "Invalid request"))
		return
	}

	err = json.NewDecoder(r.Body).Decode(book)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		return
	}

	updatedBook, err := b.bs.Update(book)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		return
	}

	util.Respond(w, util.Success("success", updatedBook))

}

// bookByID returns a book by it's ID
func (b *Books) bookByID(w http.ResponseWriter, r *http.Request) (*models.Book, error) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slogger.InvalidArg(err.Error())
		return nil, err
	}
	book, err := b.bs.ByID(uint(id))
	if err != nil {
		slogger.InvalidArg(err.Error())
		return nil, err
	}
	return book, nil
}
