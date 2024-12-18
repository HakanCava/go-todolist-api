package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Todo struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title       *string            `bson:"title" json:"title"`
	Description *string            `bson:"description" json:"description"`
	Completed   *bool              `bson:"completed" json:"completed"`
	IsTrash     *bool              `bson:"isTrash" json:"isTrash"`
}
