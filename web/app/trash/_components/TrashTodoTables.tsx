"use client";
import {
  deleteTodo,
  getAllTrashTodos,
  gotoOrRevokeTrash,
} from "@/components/api";
import { TodoModal } from "@/components/modals/TodoModal";
import { Todo } from "@/components/types";
import { DataTable } from "@/components/ui/DataTable";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { FileCheck, FileX, Trash2, Undo } from "lucide-react";
import React from "react";

const TrashTodoTables = () => {
  const { data, refetch } = useQuery({
    queryKey: ["trash-todos"],
    queryFn: getAllTrashTodos,
  });
  console.log("trash-todos: ", data);

  const todoColumns: ColumnDef<Todo>[] = [
    {
      accessorKey: "",
      header: "Todos",
      cell: ({ row }) => {
        console.log("row: ", row);
        if (row.original.completed) {
          return <FileCheck className="text-green-400" />;
        } else {
          return <FileX className="text-red-400" />;
        }
      },
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "completed",
      header: "Done",
      cell: ({ row }) => {
        if (row.original.completed) {
          return "completed";
        } else {
          return "notCompleted";
        }
      },
    },
    {
      id: "undo-todo",
      accessorKey: "",
      header: "",
      cell: ({ row }) => (
        <Undo
          className="h-6 w-6 border bg-slate-50  cursor-pointer"
          onClick={async () => {
            await gotoOrRevokeTrash(row.original._id, false);
            await refetch();
          }}
        />
      ),
    },
    {
      id: "delete-todo",
      accessorKey: "",
      header: "",
      cell: ({ row }) => (
        <TodoModal
          title="Delete"
          description="Are you sure to delete 'todo' infinitely?"
          cancelButtonTitle="Cancel"
          actionButtonTitle="Confirm"
          onAction={async () => {
            await deleteTodo(row.original._id);
            await refetch();
          }}
        >
          <Trash2 className="h-6 w-6 border bg-slate-50  cursor-pointer" />
        </TodoModal>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={todoColumns} data={data || []} />
    </div>
  );
};

export default TrashTodoTables;
