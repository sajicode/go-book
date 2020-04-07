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
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}

	response, err := u.us.Create(user)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		return
	}
	err = u.emailer.Welcome(response.FirstName, response.Email)
	if err != nil {
		slogger.InvalidRequest(err.Error())
	}
	util.Respond(w, util.Success("success", response))
}

// Login is used to authenticate a user w/ their email & password
// POST /users/login
func (u *Users) Login(w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	err := json.NewDecoder(r.Body).Decode(user)
	if err != nil {
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}

	foundUser, err := u.us.Authenticate(user.Email, user.Password)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		util.Respond(w, util.Fail("fail", err.Error()))
		return
	}
	util.Respond(w, util.Success("success", foundUser))
}