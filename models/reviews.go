package models

import "github.com/jinzhu/gorm"

// Review struct represents the structure of our reviews in the DB
type Review struct {
	gorm.Model
	UserID uint   `gorm:"not_null;index;auto_preload" json:"user_id"`
	User   User   `gorm:"-" json:"user"`
	BookID uint   `gorm:"not_null;index" json:"book_id"`
	notes  string `gorm:"not_null" json:"notes"`
}

// ReviewDB interface
type ReviewDB interface {
	ByID(id uint) (*Review, error)
	Create(review *Review) (*Review, error)
	Update(review *Review) (*Review, error)
	Delete(id uint) error
	ByUserID(id uint) ([]Review, error)
	ByBookID(id uint) ([]Review, error)
}

// NewReviewService tells the DB to create a new review
func NewReviewService(db *gorm.DB) ReviewService {
	return &reviewService{
		ReviewDB: &reviewValidator{&reviewGorm{db}},
	}
}

// ReviewService interface communicates with the reviewDB interface
type ReviewService interface {
	ReviewDB
}

type reviewService struct {
	ReviewDB
}

type reviewValidationFunc func(*Review) error

// runReviewValidationFunc runs all validations related to reviews interaction with the DB
func runReviewValidationFunc(review *Review, fns ...reviewValidationFunc) error {
	for _, fn := range fns {
		if err := fn(review); err != nil {
			return err
		}
	}
	return nil
}

// * validations

// reviewValidator struct 
type reviewValidator struct {
	ReviewDB
}

// Create validator for creating a review
func (rv *reviewValidator) Create(review *Review) (*Review, error) {
	err := runReviewValidationFunc(review,
		rv.userIDRequired,
		rv.bookIDRequired,
		rv.reviewNotesRequired)
	if err != nil {
		return nil, err
	}
	return rv.ReviewDB.Create(review)
}

// Update validator for review
func (rv *reviewValidator) Update(review *Review) (*Review, error) {
	err := runReviewValidationFunc(review,
		rv.userIDRequired,
		rv.bookIDRequired,
		rv.reviewNotesRequired)
	if err != nil {
		return nil, err
	}
	return rv.ReviewDB.Update(review)
}

// Delete validator for deleting a review
func (rv *reviewValidator) Delete(id uint) (error) {
	if id <= 0 {
		return ErrInvalidID
	}
	return rv.ReviewDB.Delete(id)
}

// userIDRequired makes sure a userid is available while creating a review
func (rv *reviewValidator) userIDRequired(r *Review) error {
	if r.UserID <= 0 {
		return ErrUserIDRequired
	}
	return nil
}

// bookIDRequired makes sure a bookid is available while creating a review
func (rv *reviewValidator) bookIDRequired(r *Review) error {
	if r.BookID <= 0 {
		return ErrBookIDRequired
	}
	return nil
}

// reviewNotesRequired makes sure a title is available while creating a review
func (rv *reviewValidator) reviewNotesRequired(r *Review) error {
	if r.notes == "" {
		return ErrReviewRequired
	}
	return nil
}

var _ ReviewDB = &reviewGorm{}

// reviewGorm struct takes in the database
type reviewGorm struct {
	db *gorm.DB
}

// ByID gets a review by it's ID
func (rg *reviewGorm) ByID(id uint) (*Review, error) {
	var review Review
	db := rg.db.Where("id = ?", id)
	err := first(db, &review)
	return &review, err
}

// Create func creates a new review in the DB
func (rg *reviewGorm) Create(review *Review) (*Review, error) {
	// review.User = User{}
	err := rg.db.Create(&review).Error
	if err != nil {
		return nil, err
	}
	return review, nil
}

// Update func updates a review in the DB
func (rg *reviewGorm) Update(review *Review) (*Review, error) {
	err := rg.db.Save(&review).Error
	if err != nil {
		return nil, err
	}
	return review, nil
}

// Delete will delete the review with the provided ID
func (rg *reviewGorm) Delete(id uint) error {
	review := Review{Model: gorm.Model{ID: id}}
	return rg.db.Delete(&review).Error
}

// ByUserID fetches all reviews by a user
func (rg *reviewGorm) ByUserID(userID uint) ([]Review, error) {
	var reviews []Review
	err := rg.db.Where("user_id = ?", userID).Find(&reviews).Error
	if err != nil {
		return nil, err
	}
	return reviews, nil
}

// ByBookID fetches all reviews for a book
func (rg *reviewGorm) ByBookID(bookID uint) ([]Review, error) {
	var reviews []Review
	err := rg.db.Where("book_id = ?", bookID).Find(&reviews).Error
	if err != nil {
		return nil, err
	}
	return reviews, nil
}

// First will query using the provided gorm.DB and it will
// get the first item returned and place it into dst. If
// nothing is found in the query, it will return ErrNotFound
func first(db *gorm.DB, dst interface{}) error {
	err := db.First(dst).Error
	if err == gorm.ErrRecordNotFound {
		return ErrNotFound
	}
	return err
}