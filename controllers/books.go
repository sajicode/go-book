package controllers

import (
	"encoding/json"
	"net/http"

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
