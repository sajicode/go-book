package models

import (
	"regexp"
	"time"
	"os"
	"strings"

	"github.com/jinzhu/gorm"
	"github.com/sajicode/go-book/hash"
	"github.com/sajicode/go-book/rand"
	"golang.org/x/crypto/bcrypt"
)

var userPwPepper = os.Getenv("USER_PASSWORD_PEPPER")
var hmacSecretKey = os.Getenv("HMAC_SECRET_KEY")

// User represents the user model stored in our database
// This is used for user accounts, storing both an email
// address and a password so users can log in and gain
// access to their content.
type User struct {
	gorm.Model
	Avatar string `gorm:"size:255;null;DEFAULT:'https://res.cloudinary.com/sajicode/image/upload/v1549973773/avatar.png'" json:"avatar"`
	FirstName	string `gorm:"size:255;not null" json:"first_name"`
	LastName	string `gorm:"size:255;not null" json:"last_name"`
	Email	string `gorm:"not null;unique_index" json:"email"`
	Password     string `gorm:"-"`
	PasswordHash string `gorm:"not null" json:"password_hash"`
	Remember     string `gorm:"-"`
	RememberHash string `gorm:"not null;unique_index" json:"remember_hash"`
	Books	[]Book `gorm:"-" json:"books"`
	Reviews []Review `gorm:"-" json:"reviews"`
}

// UserDB is used to interact with the users database.
//
// For pretty much all single user queries:
// If the user is found, we will return a nil error
// If the user is not found, we will return ErrNotFound
// If there is another error, we will return an error with
// more information about what went wrong. This may not be
// an error generated by the models package.
//
// For single user queries, any error but ErrNotFound should
// probably result in a 500 error.
type UserDB interface {
	// Methods for querying for single users
	ByID(id uint) (*User, error)
	ByEmail(email string) (*User, error)
	ByRemember(token string) (*User, error)

	// Methods for altering users
	Create(user *User) (*User, error)
	Update(user *User) (*User, error)
	Delete(id uint) error
	AllUsers(limit, page int) ([]User, error)
}

// UserService is a set of methods used to manipulate and
// work with the user model
type UserService interface {
	// Authenticate will verify the provided email address and
	// password are correct. If they are correct, the user
	// corresponding to that email will be returned. Otherwise
	// You will receive either:
	// ErrNotFound, ErrInvalidPassword, or another error if
	// something goes wrong.
	Authenticate(email, password string) (*User, error)
	// InitiateReset will start the reset password process
	// by creating a reset token for the user found with the
	// provided email address.
	InitiateReset(email string) (string, error)
	CompleteReset(token, newPw string) (*User, error)
	UserDB
}

// NewUserService handles connection to the DB
func NewUserService(db *gorm.DB) UserService {
	ug := &userGorm{db}
	hmac := hash.NewHMAC(hmacSecretKey)
	uv := newUserValidator(ug, hmac)
	return &userService{
		UserDB: uv,
		pwResetDB: newPwResetValidator(&pwResetGorm{db}, hmac),
	}
}

var _ UserService = &userService{}

// userService struct
type userService struct {
	UserDB
	pwResetDB pwResetDB
}

// Authenticate can be used to authenticate a user with the
// provided email address and password.
// If the email address provided is invalid, this will return
//   nil, ErrNotFound
// If the password provided is invalid, this will return
//   nil, ErrInvalidPassword
// If the email and password are both valid, this will return
//   user, nil
// Otherwise if another error is encountered this will return
//   nil, error
func (us *userService) Authenticate(email, password string) (*User, error) {
	foundUser, err := us.ByEmail(email)
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(foundUser.PasswordHash), []byte(password+userPwPepper))
	if err != nil {
		switch err {
		case bcrypt.ErrMismatchedHashAndPassword:
			return nil, ErrPasswordIncorrect
		default:
			return nil, err
		}
	}

	return foundUser, nil
}

// InitiateReset triggers the password reset action
func (us *userService) InitiateReset(email string) (string, error) {
	user, err := us.ByEmail(email)
	if err != nil {
		return "", err
	}
	pwr := pwReset{
		UserID: user.ID,
	}
	if err := us.pwResetDB.Create(&pwr); err != nil {
		return "", err
	}
	return pwr.Token, nil
}

// CompleteReset finalizes the process of password reset
func (us *userService) CompleteReset(token, newPw string) (*User, error) {
	pwr, err := us.pwResetDB.ByToken(token)
	if err != nil {
		if err == ErrNotFound {
			return nil, ErrTokenInvalid
		}
		return nil, err
	}
	//* check if token has expired - 3 hour shelf life
	if time.Now().Sub(pwr.CreatedAt) > (3 * time.Hour) {
		return nil, ErrTokenInvalid
	}
	user, err := us.ByID(pwr.UserID)
	if err != nil {
		return nil, err
	}
	user.Password = newPw
	updatedUser, err := us.Update(user)
	if err != nil {
		return nil, err
	}
	us.pwResetDB.Delete(pwr.ID)
	return updatedUser, nil
}

// * validators

type userValFunc func(*User) error

func runUserValFuncs(user *User, fns ...userValFunc) error {
	for _, fn := range fns {
		if err := fn(user); err != nil {
			return err
		}
	}
	return nil
}

var _ UserDB = &userValidator{}

// userValidator struct holds the structure for theuser validation
type userValidator struct {
	UserDB
	hmac hash.HMAC
	emailRegex *regexp.Regexp
}

// newUserValidator function
func newUserValidator(udb UserDB, hmac hash.HMAC) *userValidator {
	return &userValidator{
		UserDB: udb,
		hmac: hmac,
		emailRegex: regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,16}$`),
	}
}

// ByEmail validator
func (uv *userValidator) ByEmail(email string) (*User, error) {
	user := User{
		Email: email,
	}
	if err := runUserValFuncs(&user, uv.normalizeEmail); err != nil {
		return nil, err
	}
	return uv.UserDB.ByEmail(user.Email)
}

// ByRemember will hash the remember token and then call
// ByRemember on the subsequent UserDB layer.
func (uv *userValidator) ByRemember(token string) (*User, error) {
	user := User{
		Remember: token,
	}
	if err := runUserValFuncs(&user, uv.hmacRemember); err != nil {
		return nil, err
	}
	return uv.UserDB.ByRemember(user.RememberHash)
}

// Create will create the provided user and backfill data
// like the ID, CreatedAt, and UpdatedAt fields.
func (uv *userValidator) Create(user *User) (*User, error) {
	err := runUserValFuncs(
		user,
		uv.passwordRequired,
		uv.passwordMinLength,
		uv.bcryptPassword,
		uv.passwordHashRequired,
		uv.setRememberIfUnset,
		uv.rememberMinBytes,
		uv.hmacRemember,
		uv.rememberHashRequired,
		uv.normalizeEmail,
		uv.requireEmail,
		uv.emailFormat,
		uv.emailIsAvail)
	if err != nil {
		return nil, err
	}
	return uv.UserDB.Create(user)
}

// Update will hash a remember token if it is provided.
func (uv *userValidator) Update(user *User) (*User, error) {
	err := runUserValFuncs(
		user,
		uv.passwordMinLength,
		uv.bcryptPassword,
		uv.passwordHashRequired,
		uv.rememberMinBytes,
		uv.hmacRemember,
		uv.rememberHashRequired,
		uv.normalizeEmail,
		uv.requireEmail,
		uv.emailFormat,
		uv.emailIsAvail)
	if err != nil {
		return nil, err
	}
	return uv.UserDB.Update(user)
}

// Delete will delete the user with the provided ID
func (uv *userValidator) Delete(id uint) error {
	var user User
	user.ID = id
	err := runUserValFuncs(&user, uv.idGreaterThan(0))
	if err != nil {
		return err
	}
	return uv.UserDB.Delete(id)
}

// bcryptPassword will hash a user's password with a
// predefined pepper (userPwPepper) and bcrypt if the
// Password field is not the empty string
func (uv *userValidator) bcryptPassword(user *User) error {
	if user.Password == "" {
		return nil
	}
	pwBytes := []byte(user.Password + userPwPepper)
	hashedBytes, err := bcrypt.GenerateFromPassword(pwBytes, bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.PasswordHash = string(hashedBytes)
	user.Password = ""
	return nil
}

// hmacRemember to remember our token
func (uv *userValidator) hmacRemember(user *User) error {
	if user.Remember == "" {
		return nil
	}
	user.RememberHash = uv.hmac.Hash(user.Remember)
	return nil
}

// setRemember updates our remember value if unset
func (uv *userValidator) setRememberIfUnset(user *User) error {
	if user.Remember != "" {
		return nil
	}
	token, err := rand.RememberToken()
	if err != nil {
		return err
	}
	user.Remember = token
	return nil
}

// rememberHashRequired checks for a remember hash
func (uv *userValidator) rememberHashRequired(user *User) error {
	if user.RememberHash == "" {
		return ErrRememberRequired
	}
	return nil
}

// idGreaterThan functiins checks valid IDs
func (uv *userValidator) idGreaterThan(n uint) userValFunc {
	return userValFunc(func(user *User) error {
		if user.ID <= n {
			return ErrInvalidID
		}
		return nil
	})
}

// normalizeEmail trims whitespace and converts to lowercase
func (uv *userValidator) normalizeEmail(user *User) error {
	user.Email = strings.ToLower(user.Email)
	user.Email = strings.TrimSpace(user.Email)
	return nil
}

// requireEmail ensures the email field is passed in
func (uv *userValidator) requireEmail(user *User) error {
	if user.Email == "" {
		return ErrEmailRequired
	}
	return nil
}

// emailFormat formats an email with the regex variable
func (uv *userValidator) emailFormat(user *User) error {
	if user.Email == "" {
		return nil
	}
	if !uv.emailRegex.MatchString(user.Email) {
		return ErrEmailInvalid
	}
	return nil
}

// emailIsAvail checks if an email has been taken
func (uv *userValidator) emailIsAvail(user *User) error {
	existing, err := uv.ByEmail(user.Email)
	if err == ErrNotFound {
		// Email address is available
		return nil
	}
	if err != nil {
		return err
	}

	// * We found a user with this email address...
	// * If the found user has the same ID as this user, it is an update & this is the same user
	if user.ID != existing.ID {
		return ErrEmailTaken
	}
	return nil
}

// passwordMinLength checks the length of the entered password
func (uv *userValidator) passwordMinLength(user *User) error {
	if user.Password == "" {
		return nil
	}
	if len(user.Password) < 8 {
		return ErrPasswordTooShort
	}
	return nil
}

// passwordRequired ensures password is entered
func (uv *userValidator) passwordRequired(user *User) error {
	if user.Password == "" {
		return ErrPasswordRequired
	}
	return nil
}

// passwordHashRequired checks for a password hash
func (uv *userValidator) passwordHashRequired(user *User) error {
	if user.PasswordHash == "" {
		return ErrPasswordRequired
	}
	return nil
}

// rememberMinBytes function
func (uv *userValidator) rememberMinBytes(user *User) error {
	if user.Remember == "" {
		return nil
	}
	n, err := rand.NBytes(user.Remember)
	if err != nil {
		return err
	}
	if n < 32 {
		return ErrRememberTooShort
	}
	return nil
}

// * DB interfaces

var _ UserDB = &userGorm{}

// userGorm takes in implements the DB
type userGorm struct {
	db *gorm.DB
}

// ByID will look up a user with the provided ID.
// If the user is found, we will return a nil error
// If the user is not found, we will return ErrNotFound
// If there is another error, we will return an error with
// more information about what went wrong. This may not be
// an error generated by the models package.
//
// As a general rule, any error but ErrNotFound should
// probably result in a 500 error.
func (ug *userGorm) ByID(id uint) (*User, error) {
	var user User
	db := ug.db.Where("id = ?", id)
	err := first(db, &user)
	return &user, err
}

// ByEmail looks up a user with the given email address and
// returns that user.
// If the user is found, we will return a nil error
// If the user is not found, we will return ErrNotFound
// If there is another error, we will return an error with
// more information about what went wrong. This may not be
// an error generated by the models package.
//
// As a general rule, any error but ErrNotFound should
// probably result in a 500 error.
func (ug *userGorm) ByEmail(email string) (*User, error) {
	var user User
	db := ug.db.Where("email = ?", email)
	err := first(db, &user)
	return &user, err
}

// ByRemember looks up a user with the given remember token
// and returns that user. This method expects the remember
// token to already be hashed.
// Errors are the same as ByEmail.
func (ug *userGorm) ByRemember(rememberHash string) (*User, error) {
	var user User
	err := first(ug.db.Where("remember_hash = ?", rememberHash), &user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// Create will create the provided user and backfill data
// like the ID, CreatedAt, and UpdatedAt fields.
func (ug *userGorm) Create(user *User) (*User, error) {
	err := ug.db.Create(&user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

// Update will update the provided user with all of the data
// in the provided user object.
func (ug *userGorm) Update(user *User) (*User, error) {
	err := ug.db.Save(&user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

// Delete will delete the user with the provided ID
func (ug *userGorm) Delete(id uint) error {
	user := User{Model: gorm.Model{ID: id}}
	return ug.db.Delete(&user).Error
}

// AllUsers returns users in our DB in paginated format
func (ug *userGorm) AllUsers(limit, page int) ([]User, error) {
	dataOffset := (limit * page) - limit
	var users []User
	err := ug.db.Limit(limit).Offset(dataOffset).Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}