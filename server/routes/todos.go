package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/mongo"
)

var validate = validator.New()
var todoCollection *mongo.Collection = OpenCollection(Client, "todos")

func CreateTodo(c *gin.Context) {}

func UpdateTodo(c *gin.Context) {}

func GetTodos(c *gin.Context) {}

func GetTodoById(c *gin.Context) {}

func DeleteTodo(c *gin.Context) {}

func GetTodosFromTrash(c *gin.Context) {}

func UpdateTodoFromTrash(c *gin.Context) {}

