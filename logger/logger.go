package logger

import (
	"fmt"
	"io"
	"os"

	"github.com/sirupsen/logrus"
)

// LogEvent stores messages to log later, from our standard interface
type LogEvent struct {
	id      int
	message string
}

// MainLogger enforces specific log message formats
type MainLogger struct {
	*logrus.Logger
}

func init() {
	//* log as JSON instead of the default ASCII formatter
	logrus.SetFormatter(&logrus.JSONFormatter{})
}

// NewLogger initializes the standard logger
func NewLogger() *MainLogger {
	f, err := os.OpenFile("logrus.log", os.O_APPEND|os.O_CREATE|os.O_RDWR, 0666)
	if err != nil {
		fmt.Printf("error opening file: %v", err)
	}

	var baseLogger = logrus.New()
	var standardLogger = &MainLogger{baseLogger}

	standardLogger.Formatter = &logrus.JSONFormatter{}

	mw := io.MultiWriter(os.Stdout, f)
	standardLogger.SetOutput(mw)

	return standardLogger
}

//* Variables to store our log messages as new events
var (
	invalidArgMessage      = LogEvent{1, "Invalid arg: %s"}
	invalidArgValueMessage = LogEvent{2, "Invalid value for argument: %s: %v"}
	missingArgMessage      = LogEvent{3, "Missing arg: %s"}
	invalidRequestMessage  = LogEvent{4, "Invalid request body: %s"}
	unknownServerError     = LogEvent{5, "Unknown Server Error: %s"}
)

// InvalidArg error message"
func (l *MainLogger) InvalidArg(argumentName string) {
	l.Errorf(invalidArgMessage.message, argumentName)
}

// InvalidArgValue error message"
func (l *MainLogger) InvalidArgValue(argumentName string, argumentValue string) {
	l.Errorf(invalidArgValueMessage.message, argumentName, argumentValue)
}

// MissingArg error message"
func (l *MainLogger) MissingArg(argumentName string) {
	l.Errorf(missingArgMessage.message, argumentName)
}

// InvalidRequest error message"
func (l *MainLogger) InvalidRequest(argumentName string) {
	l.Errorf(invalidRequestMessage.message, argumentName)
}

// ServerError logs messages from unknown server errors
func (l *MainLogger) ServerError(errorString string) {
	l.Errorf(unknownServerError.message, errorString)
}
