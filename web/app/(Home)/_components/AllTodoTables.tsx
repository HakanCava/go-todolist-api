"use client";
import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTodos, gotoOrRevokeTrash } from "@/components/api";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { FileCheck, FilePlus, FileX, SquarePen, Trash2 } from "lucide-react";
import { Todo } from "@/components/types";
import TodoForm from "./TodoForm";
import TodoModalForm, { ModalRef } from "@/components/modals/TodoModalForm";

const AllTodoTables = () => {
  const updateRef = useRef<ModalRef>(null);
  const createRef = useRef<ModalRef>(null);
  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: getAllTodos,
  });
  const todoColumns: ColumnDef<Todo>[] = [
    {
      accessorKey: "",
      header: "Todos",
      cell: ({ row }) => {
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
      id: "trash-action",
      accessorKey: "",
      header: "",
      cell: ({ row }) => (
        <Trash2
          className="h-5 w-5 cursor-pointer"
          onClick={async () => {
            await gotoOrRevokeTrash(row.original._id, true);
            await refetch();
          }}
        />
      ),
    },
    {
      id: "update-action",
      accessorKey: "",
      header: "",
      cell: ({ row }) => (
        <>
          <SquarePen
            className="h-5 w-5 cursor-pointer"
            onClick={() =>
              updateRef.current?.show({
                form: (
                  <TodoForm
                    title="Update"
                    mode="update"
                    mutate={refetch}
                    id={row.original._id}
                  />
                ),
                shouldBeClosedOutside: true,
              })
            }
          />
          <TodoModalForm ref={updateRef} />
        </>
      ),
    },
  ];
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    console.log("error: ", error);
    return <div>{error.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center items-center mb-5">
        <button
          className="text-white flex justify-center items-center gap-3"
          onClick={() =>
            createRef.current?.show({
              form: <TodoForm title="Create" mode="create" mutate={refetch} />,
              shouldBeClosedOutside: true,
            })
          }
        >
          <FilePlus className="h-5 w-5 cursor-pointer" />
          <span>Create Todo</span>
        </button>
      </div>
      <DataTable columns={todoColumns} data={data || []} />
      <TodoModalForm ref={createRef} />
    </div>
  );
};

export default AllTodoTables;
