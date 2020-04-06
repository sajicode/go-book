package models

import "strings"

const (
	// ErrNotFound is returned when a resource cannot be found
	// in the database.
	ErrNotFound modelError = "models: resource not found"

	// ErrInvalidPassword is returned when an invalid password
	// is used when attempting to authenticate a user.
	ErrPasswordIncorrect modelError = "models: incorrect password provided"

	// ErrEmailRequired is returned when an email address is
	// not provided when creating a user
	ErrEmailRequired modelError = "models: email address is required"

	// ErrEmailInvalid is returned when an email address provided
	// does not match any of our requirements
	ErrEmailInvalid modelError = "models: email address is not valid"

	// ErrEmailTaken is returned when an update or create is attempted
	// with an email address that is already in use.
	ErrEmailTaken modelError = "models: email address is already taken"

	// ErrPasswordRequired is returned when a create is attempted
	// without a user password provided.
	ErrPasswordRequired modelError = "models: password is required"

	// ErrPasswordTooShort is returned when an update or create is
	// attempted with a user password that is less than 8 characters.
	ErrPasswordTooShort modelError = "models: password must be at least 8 characters long"

	// ErrTitleRequired is returned when a title is not added to a book
	ErrTitleRequired modelError = "models: book title is required"

	// ErrBookAuthorRequired is returned when an author is not added to a book
	ErrBookAuthorRequired modelError = "models: book author is required"

	// ErrBookSummaryRequired is returned when a summary is not added to a book
	ErrBookSummaryRequired modelError = "models: book summary is required"

	// ErrBookCategoryRequired is returned when a category is not added to a book
	ErrBookCategoryRequired modelError = "models: book category is required"

	// ErrBookImageRequired is returned when an image is not added to a book
	ErrBookImageRequired modelError = "models: book image is required"

	// ErrInvalidID is returned when an invalid ID is provided
	// to a method like Delete.
	ErrInvalidID privateError = "models: ID provided was invalid"

	// ErrRememberRequired is returned when a create or update
	// is attempted without a user remember token hash
	ErrRememberRequired privateError = "models: remember token is required"

	// ErrRememberTooShort is returned when a remember token is
	// not at least 32 bytes
	ErrRememberTooShort privateError = "models: remember token must be at least 32 bytes"

	// ErrUserIDRequired is returned when a user ID is not passed in for comment creation
	ErrUserIDRequired privateError = "models: user ID is required"

	// ErrBookIDRequired is returned when a user ID is not passed in for comment creation
	ErrBookIDRequired privateError = "models: book ID is required"

	// ErrInvalidRequest is returned when the required parameters are not passed while creating a model
	ErrInvalidRequest privateError = "models: request is incomplete/invalid"

	// ErrReviewRequired is returned when a review note is not passed in for comment creation
	ErrReviewRequired privateError = "models: review note is required"

	// ErrTokenInvalid const for invalid token errors
	ErrTokenInvalid modelError = "models: token provided is not valid"
)

type modelError string

// Error function that returns formats error messages
func (e modelError) Error() string {
	return string(e)
}

// Public func returns public error messages
func (e modelError) Public() string {
	s := strings.Replace(string(e), "models: ", "", 1)
	split := strings.Split(s, " ")
	split[0] = strings.Title(split[0])
	return strings.Join(split, " ")
}

type privateError string

// Error formatter for dev error messages
func (e privateError) Error() string {
	return string(e)
}
