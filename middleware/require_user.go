package middleware

import (
	"net/http"
	"net/url"

	"github.com/sajicode/go-book/context"
	"github.com/sajicode/go-book/logger"
	"github.com/sajicode/go-book/models"
	util "github.com/sajicode/go-book/utils"
)

//* logger
var slogger = logger.NewLogger()

// User struct
type User struct {
	models.UserService
}

// Apply middleware takes http handler as arg and returns ApplyFn function
func (u *User) Apply(next http.Handler) http.HandlerFunc {
	return u.ApplyFn(next.ServeHTTP)
}

// ApplyFn middleware to controller
func (u *User) ApplyFn(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		cookie, err := r.Cookie("remember_token")
		if err != nil {
			slogger.InvalidRequest(err.Error())
			w.Header().Add("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			util.Respond(w, util.Fail("fail", "Unauthorized. Login to access this page"))
			return
		}
		cookieData, err := url.QueryUnescape(cookie.Value)
		if err != nil {
			slogger.InvalidRequest(err.Error())
			w.Header().Add("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			util.Respond(w, util.Fail("fail", "Unauthorized. Login to access this page"))
			return
		}

		user, err := u.UserService.ByRemember(cookieData)
		if err != nil {
			slogger.InvalidRequest(err.Error())
			w.Header().Add("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			util.Respond(w, util.Fail("fail", "Unauthorized. Login to access this page"))
			return
		}
		ctx := r.Context()
		ctx = context.WithUser(ctx, user)
		r = r.WithContext(ctx)
		next(w, r)
	})
}

//TODO we might not need the functions below

// RequireUser struct holds the fields required
type RequireUser struct {
	User
}

// Apply assumes that User middleware has already been run,
// otherwise it will not work correctly
func (mw *RequireUser) Apply(next http.Handler) http.HandlerFunc {
	return mw.ApplyFn(next.ServeHTTP)
}

// ApplyFn assumes that User middleware has already been run
func (mw *RequireUser) ApplyFn(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := context.User(r.Context())
		if user == nil {
			w.Header().Add("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			util.Respond(w, util.Fail("fail", "Unauthorized. Login to access this page"))
		}
		next(w, r)
	})
}
