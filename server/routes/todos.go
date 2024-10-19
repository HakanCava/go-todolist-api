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

func GetTodos(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	var todos []bson.M

	filter := bson.M{"isTrash": false} // only isTrash: false
	cursor, err := todoCollection.Find(ctx, filter)
	if checkErr(c, err) {
		return
	}

	if err := cursor.All(ctx, &todos); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	fmt.Println(todos)
	c.JSON(http.StatusOK, todos)
}

func GetTodoById(c *gin.Context) {
	todoId := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(todoId)
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	var todo bson.M
	if err := todoCollection.FindOne(ctx, bson.M{"_id": docID}).Decode(&todo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	fmt.Println(todo)
	c.JSON(http.StatusOK, todo)
}

func UpdateTodoFromTrash(c *gin.Context) {
	todoId := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(todoId)
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	type IsTrash struct {
		IsTrash *bool `json:"isTrash"`
	}
	var isTrash IsTrash
	if err := c.BindJSON(&isTrash); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	var existingTodo bson.M
	err := todoCollection.FindOne(ctx, bson.M{"_id": docID}).Decode(&existingTodo)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			fmt.Println(err)
			return
		}
	}

	result, err := todoCollection.UpdateOne(ctx, bson.M{"_id": docID}, bson.D{{Key: "$set", Value: bson.D{{Key: "isTrash", Value: isTrash.IsTrash}}}})

	if checkErr(c, err) {
		return
	}

	c.JSON(http.StatusOK, result.ModifiedCount)
}

func GetTodosFromTrash(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	var todos []bson.M

	filter := bson.M{"isTrash": true} // only isTrash: true
	cursor, err := todoCollection.Find(ctx, filter)
	if checkErr(c, err) {
		return
	}

	if err := cursor.All(ctx, &todos); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	fmt.Println(todos)
	c.JSON(http.StatusOK, todos)
}

func DeleteTodo(c *gin.Context) {
	todoId := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(todoId)
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var existingTodo bson.M
	err := todoCollection.FindOne(ctx, bson.M{"_id": docID}).Decode(&existingTodo)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			fmt.Println(err)
			return
		}
	}

	result, err := todoCollection.DeleteOne(ctx, bson.M{"_id": docID})
	if checkErr(c, err) {
		return
	}
	c.JSON(http.StatusOK, result.DeletedCount)
}

func checkErr(c *gin.Context, err error) bool {
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return true
	}
	return false
}
