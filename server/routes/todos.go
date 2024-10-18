package routes

import (
	"context"
	"fmt"
	"net/http"
	"time"
	"todolist/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var validate = validator.New()
var todoCollection *mongo.Collection = OpenCollection(Client, "todos")

func CreateTodo(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	var todo models.Todo
	if err := c.BindJSON(&todo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	validationErr := validate.Struct(todo)
	if validationErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}
	todo.ID = primitive.NewObjectID()
	result, insertErr := todoCollection.InsertOne(ctx, todo)
	if insertErr != nil {
		msg := "Todo was not created!"
		c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		return
	}
	c.JSON(http.StatusOK, result)
}

func UpdateTodo(c *gin.Context) {
	todoID := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(todoID)
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	var todo models.Todo

	if err := c.BindJSON(&todo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	validationErr := validate.Struct(todo)
	if validationErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": validationErr.Error()})
		return
	}
	var existingTodo bson.M
	err := todoCollection.FindOne(ctx, bson.M{"_id": docID}).Decode(&existingTodo)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		fmt.Println(err)
		return
	}

	result, err := todoCollection.ReplaceOne(
		ctx,
		bson.M{"_id": docID},
		bson.M{
			"title":       todo.Title,
			"description": todo.Description,
			"completed":   todo.Completed,
			"isTrash":     todo.IsTrash,
		},
	)

	if checkErr(c, err) { 
		return
	}
	c.JSON(http.StatusOK, result.ModifiedCount)
}

func GetTodos(c *gin.Context) {}

func GetTodoById(c *gin.Context) {}

func DeleteTodo(c *gin.Context) {}

func GetTodosFromTrash(c *gin.Context) {}

func UpdateTodoFromTrash(c *gin.Context) {}

func checkErr(c *gin.Context, err error) bool {
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return true
	}
	return false
}
