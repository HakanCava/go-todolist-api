package routes

import (
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/mongo"
)

var validate = validator.New()
var todoCollection *mongo.Collection = OpenCollection(Client, "todos")
