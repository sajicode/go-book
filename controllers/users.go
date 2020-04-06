package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/sajicode/go-book/email"
	"github.com/sajicode/go-book/logger"
	"github.com/sajicode/go-book/models"
	util "github.com/sajicode/go-book/utils"
)

//* logger
var slogger = logger.NewLogger()

// Users controller structure
type Users struct {
	us models.UserService
	emailer email.Client
}

// NewUsers is used to create a new user controller
func NewUsers(us models.UserService, emailer email.Client) *Users {
	return &Users{
		us: us,
		emailer: emailer,
	}
}


// Create a new user
// POST /users/signup
func (u *Users) Create(w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	err := json.NewDecoder(r.Body).Decode(user)
	if err != nil {
		util.Respond(w, util.Message(false, string(models.ErrInvalidRequest)))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}

	response, err := u.us.Create(user)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Message(false, string(models.ErrInvalidRequest)))
		return
	}
	util.Respond(w, response)
}