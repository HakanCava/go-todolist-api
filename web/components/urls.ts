export const baseUrl = "http://localhost:5500";

export const urls = {
  getAllTodos: `${baseUrl}/todos`,
  getTodo: `${baseUrl}/todo/:id`,
  gotoOrRevokeTrash: `${baseUrl}/todo/update-trash/:id`,
  createTodo: `${baseUrl}/todo/create`,
  updateTodo: `${baseUrl}/todo/update/:id`,
  getAllTodosFromTrash: `${baseUrl}/todos/trash`,
  deleteTodo: `${baseUrl}/todo/delete/:id`,
};
