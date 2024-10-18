package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"todolist/routes"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5500"
	}
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(cors.Default())

	router.POST("/todo/create", routes.CreateTodo)
	router.PUT("/todo/update/:id", routes.UpdateTodo)
	router.GET("/todos", routes.GetTodos)
	router.GET("/todo/:id", routes.GetTodoById)
	router.DELETE("/todo/create", routes.DeleteTodo)
	router.GET("/todos/trash", routes.GetTodosFromTrash)
	router.PATCH("/todo/trash", routes.UpdateTodoFromTrash)
	router.Run(":" + port)
}
