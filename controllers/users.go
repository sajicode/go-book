package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/sajicode/go-book/email"
	"github.com/sajicode/go-book/logger"
	"github.com/sajicode/go-book/models"
	"github.com/sajicode/go-book/rand"
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

	newUser, err := u.us.Create(user)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		return
	}
	err = u.emailer.Welcome(newUser.FirstName, newUser.Email)
	if err != nil {
		slogger.InvalidRequest(err.Error())
	}
	
	err = u.signIn(w, newUser)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		return
	}
	util.Respond(w, util.Success("success", newUser))
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
	err = u.signIn(w, foundUser)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		return
	}
	util.Respond(w, util.Success("success", foundUser))
}

// signIn creates and returns a cookie for an authenticated user
func (u *Users) signIn(w http.ResponseWriter, user *models.User) error {
	if user.Remember == "" {
		token, err := rand.RememberToken()
		if err != nil {
			return err
		}
		user.Remember = token
		_, err = u.us.Update(user)
		if err != nil {
			return err
		}
	}
	cookie := http.Cookie{
		Name:     "remember_token",
		Value:    user.Remember,
	}
	http.SetCookie(w, &cookie)
	return nil
}

// ResetPwForm is used to process the forgot password form
// and the reset password form.
type ResetPwForm struct {
	Email    string `json:"email"`
	Token    string `json:"token"`
	Password string `json:"password"`
}

// ResponseMessage holds the structure of a normal message to the client
type ResponseMessage struct {
	Message string `json:"message"`
}

// InitiateReset starts the process of resetting a user's password
// POST /users/forgot
func (u *Users) InitiateReset(w http.ResponseWriter, r *http.Request) {
	form := &ResetPwForm{}
	err := json.NewDecoder(r.Body).Decode(form)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}
	token, err := u.us.InitiateReset(form.Email)

	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}

	err = u.emailer.ResetPw(form.Email, token)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}
	message := &ResponseMessage{
		Message: "Instructions for resetting your password have been emailed to you.",
	}
	util.Respond(w, util.Success("success", message))
}

// CompleteReset rounds up the process of resetting a user's password
func (u *Users) CompleteReset(w http.ResponseWriter, r *http.Request) {
	//* get token from url
	token := r.URL.Query().Get("token")
	form := &ResetPwForm{}
	err := json.NewDecoder(r.Body).Decode(form)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}
	user, err := u.us.CompleteReset(token, form.Password);
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		slogger.InvalidRequest(string(models.ErrInvalidRequest))
		return
	}
	err = u.signIn(w, user)
	if err != nil {
		slogger.InvalidRequest(err.Error())
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		util.Respond(w, util.Fail("fail", err.Error()))
		return
	}
	util.Respond(w, util.Success("success", user))
}