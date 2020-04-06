package models

import "github.com/jinzhu/gorm"

// Book struct represents the DB structure of our Books
type Book struct {
	gorm.Model
	UserID   uint     `gorm:"not_null;index;auto_preload" json:"user_id"`
	Title    string   `gorm: "not_null" json:"title"`
	Author   string   `gorm: "not_null" json:"author"`
	Category string   `gorm: "not_null" json:"category"`
	Summary  string   `gorm: "not_null" json:"summary"`
	Image    string   `gorm: "not_null" json:"image"`
	reviews  []Review `gorm:"-" json:"reviews"`
}

// BookDB interface
type BookDB interface {
	ByID(id uint) (*Book, error)
	Create(book *Book) (*Book, error)
	Update(book *Book) (*Book, error)
	Delete(id uint) error
	ByUserID(id uint) ([]Book, error)
	AllBooks(limit, page int) ([]Book, error)
}

// NewBookService tells the DB to create a new Book
func NewBookService(db *gorm.DB) BookService {
	return &bookService{
		BookDB: &bookValidator{&bookGorm{db}},
	}
}

// BookService interface
type BookService interface {
	BookDB
}

type bookService struct {
	BookDB
}

type bookValidationFunc func(*Book) error

// runBookValidationFunc runs all validations related to book interaction with the DB
func runBookValidationFunc(book *Book, fns ...bookValidationFunc) error {
	for _, fn := range fns {
		if err := fn(book); err != nil {
			return err
		}
	}
	return nil
}

// * validations

// bookValidator struct
type bookValidator struct {
	BookDB
}

// Create validator for creating a book
func (bv *bookValidator) Create(book *Book) (*Book, error) {
	err := runBookValidationFunc(book,
		bv.userIDRequired,
		bv.TitleRequired,
		bv.SummaryRequired,
		bv.CategoryRequired,
		bv.ImageRequired,
		bv.AuthorRequired)

	if err != nil {
		return nil, err
	}
	return bv.BookDB.Create(book)
}

// Update validator for updating a book
func (bv *bookValidator) Update(book *Book) (*Book, error) {
	err := runBookValidationFunc(book,
		bv.userIDRequired,
		bv.TitleRequired,
		bv.SummaryRequired,
		bv.CategoryRequired,
		bv.ImageRequired,
		bv.AuthorRequired)

	if err != nil {
		return nil, err
	}
	return bv.BookDB.Update(book)
}

// Delete validator for deleting a book
func (bv *bookValidator) Delete(id uint) error {
	if id <= 0 {
		return ErrInvalidID
	}
	return bv.BookDB.Delete(id)
}

// userIDRequired makes sure a userid is available while creating a book
func (bv *bookValidator) userIDRequired(b *Book) error {
	if b.UserID <= 0 {
		return ErrUserIDRequired
	}
	return nil
}

// TitleRequired makes sure a title is available while creating a book
func (bv *bookValidator) TitleRequired(b *Book) error {
	if b.Title == "" {
		return ErrTitleRequired
	}
	return nil
}

// AuthorRequired makes sure an author is available while creating a book
func (bv *bookValidator) AuthorRequired(b *Book) error {
	if b.Author == "" {
		return ErrBookAuthorRequired
	}
	return nil
}

// SummaryRequired makes sure a summary is available while creating a book
func (bv *bookValidator) SummaryRequired(b *Book) error {
	if b.Summary == "" {
		return ErrBookSummaryRequired
	}
	return nil
}

// CategoryRequired makes sure a category is available while creating a book
func (bv *bookValidator) CategoryRequired(b *Book) error {
	if b.Category == "" {
		return ErrBookCategoryRequired
	}
	return nil
}

// ImageRequired makes sure an image is available while creating a book
func (bv *bookValidator) ImageRequired(b *Book) error {
	if b.Image == "" {
		return ErrBookImageRequired
	}
	return nil
}

// bookGorm struct takes in the database
type bookGorm struct {
	db *gorm.DB
}

var _ BookDB = &bookGorm{}

// ByID gets a book by it's ID
func (bg *bookGorm) ByID(id uint) (*Book, error) {
	var book Book
	db := bg.db.Preload("Users").Preload("Reviews").Where("id = ?", id)
	err := first(db, &book)
	return &book, err
}

// Create func creates a new bok in the DB
func (bg *bookGorm) Create(book *Book) (*Book, error) {
	err := bg.db.Create(&book).Error
	if err != nil {
		return nil, err
	}
	return book, nil
}

// Update func updates a book in the DB
func (bg *bookGorm) Update(book *Book) (*Book, error) {
	err := bg.db.Save(&book).Error
	if err != nil {
		return nil, err
	}
	return book, nil
}

// Delete will delete the book with the provided ID
func (bg *bookGorm) Delete(id uint) error {
	book := Book{Model: gorm.Model{ID: id}}
	return bg.db.Delete(&book).Error
}

// ByUserID fetches all books by a user
func (bg *bookGorm) ByUserID(userID uint) ([]Book, error) {
	var books []Book
	err := bg.db.Preload("Reviews").Where("user_id = ?", userID).Find(&books).Error
	if err != nil {
		return nil, err
	}
	return books, nil
}

// AllBooks returns all books in the DB based on pagination
func (bg *bookGorm) AllBooks(limit, page int) ([]Book, error) {
	dataOffset := (limit * page) - limit
	var books []Book
	err := bg.db.Limit(limit).Offset(dataOffset).Find(&books).Error
	if err != nil {
		return nil, err
	}
	return books, nil
}
