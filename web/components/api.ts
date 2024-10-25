import axios from "axios";
import { urls } from "./urls";

export const getAllTodos = () => {
  return axios.get(urls.getAllTodos).then((res) => res.data);
};

export const getTodo = (id: string) => {
  return axios
    .get(urls.getTodo.replace(":id", id.toString()))
    .then((res) => res.data);
};

export const gotoOrRevokeTrash = (id: string, value: boolean) => {
  const data = {
    isTrash: value,
  };
  return axios
    .patch(urls.gotoOrRevokeTrash.replace(":id", id.toString()), data)
    .then((res) => res);
};

export const createTodo = (values: {
  title: string;
  description: string;
  completed?: boolean;
  isTrash?: boolean;
}) => {
  const data = {
    title: values.title,
    description: values.description,
    completed: values.completed ?? false,
    isTrash: values.isTrash ?? false,
  };
  return axios.post(urls.createTodo, data).then((res) => res);
};
export const updateTodo = (
  id: string,
  values: {
    title: string;
    description: string;
    completed?: boolean;
    isTrash?: boolean;
  }
) => {
  const data = {
    title: values.title,
    description: values.description,
    completed: values.completed ?? false,
    isTrash: values.isTrash ?? false,
  };
  return axios.put(urls.updateTodo.replace(":id", id), data).then((res) => res);
};

export const getAllTrashTodos = () => {
  return axios.get(urls.getAllTodosFromTrash).then((res) => res.data);
};

export const deleteTodo = (id: string) => {
  return axios.delete(urls.deleteTodo.replace(":id", id)).then((res) => res.data);
};
