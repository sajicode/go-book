package models

import (
	"os"

	"github.com/jinzhu/gorm"
	// we want to keep the postgres dialect even though we are not using it directly
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// NewServices is reponsible for connecting all our services to the DB
func NewServices(dbDriver, connectionInfo string) (*Services, error) {
	db, err := gorm.Open(dbDriver, connectionInfo)
	if err != nil {
		return nil, err
	}
	var logDB bool
	if os.Getenv("APP_ENV") == "production" {
		logDB = false
	} else {
		logDB = true
	}
	db.LogMode(logDB)
	return &Services{
		User: NewUserService(db),
		Book: NewBookService(db),
		Review: NewReviewService(db),
		db: db,
	}, nil
}

// Services struct encompasses all of our services and their structures
type Services struct {
	User	UserService
	Book	BookService
	Review	ReviewService
	db	*gorm.DB
}

// Close closes the database connection
func (s *Services) Close() error {
	return s.db.Close()
}

// DestructiveReset drops the tables and rebuilds it
func (s *Services) DestructiveReset() error {
	err := s.db.DropTableIfExists(&User{}, &Book{}, &Review{}, &pwReset{}).Error
	if err != nil {
		return err
	}
	return s.AutoMigrate()
}

// AutoMigrate will attempt to automatically migrate the tables
func (s *Services) AutoMigrate() error {
	return s.db.AutoMigrate(&User{}, &Book{}, &Review{}, &pwReset{}).Error
}