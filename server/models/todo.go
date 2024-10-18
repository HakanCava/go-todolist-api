package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Todo struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"` // only used MongoDB _id
	Title       *string            `json:"title"`
	Description *string            `json:"description"`
	Completed   *bool              `json:"completed"`
	IsTrash     *bool              `json:"isTrash"`
}
