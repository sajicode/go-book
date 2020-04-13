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

// Reviews controller struct
type Reviews struct {
	rs models.ReviewService
	bs models.BookService
}

// NewReviews is used to create a new review controller
func NewReviews(rs models.ReviewService, bs models.BookService) *Reviews {
	return &Reviews{
		rs: rs,
		bs: bs,
	}
}

// Create a new review
// POST /books/:id/review
func (rev *Reviews) Create(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		util.Respond(w, util.Fail("fail", "Book not found"))
		return
	}
	book, err := rev.bs.ByID(uint(id))
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		util.Respond(w, util.Fail("fail", "Book not found"))
		return
	}
	user := context.User(r.Context())

	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		util.Respond(w, util.Fail("fail", "Book not found"))
		return
	}
	review := &models.Review{}
	err = json.NewDecoder(r.Body).Decode(review)

	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		return
	}

	review.UserID = user.ID
	review.BookID = book.ID

	newReview, err := rev.rs.Create(review)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		return
	}
	util.Respond(w, util.Success("success", newReview))
}
