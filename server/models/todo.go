package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// type Todo struct {
// 	ID          primitive.ObjectID `bson:"_id,omitempty"` // only used MongoDB _id
// 	Title       *string            `json:"title"`
// 	Description *string            `json:"description"`
// 	Completed   *bool              `json:"completed"`
// 	IsTrash     *bool              `json:"isTrash"`
// }

type Todo struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"` // MongoDB'de _id olarak kullanılır, JSON'da id olarak
	Title       *string            `bson:"title" json:"title"`
	Description *string            `bson:"description" json:"description"`
	Completed   *bool              `bson:"completed" json:"completed"`
	IsTrash     *bool              `bson:"isTrash" json:"isTrash"` // Hem MongoDB hem JSON'da isTrash olarak kullanılır
}
