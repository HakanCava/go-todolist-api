"use client";
import React, { FC } from "react";
import { useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { createTodo, getTodo, updateTodo } from "@/components/api";
import { toast } from "sonner";

interface Props {
  title: string;
  id?: string;
  mode: "create" | "update";
  mutate?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<unknown, Error>>;
}

const schema = z.object({
  title: z.string().min(3, "Title is required min 3 character"),
  description: z.string().min(10, "Description is required min 10 character"),
  completed: z.boolean().optional(),
});

export type FormValues = {
  title: string;
  description: string;
  completed?: boolean;
  isTrash?: boolean;
};

const TodoForm: FC<Props> = ({ id, title, mode, mutate }) => {
  const { data } = useQuery({
    queryKey: ["todo"],
    queryFn: () => id && getTodo(id),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onTouched",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    console.log("Form submitted values: ", values);
    try {
      if (id && mode === "update") {
        //update
        await updateTodo(id, values);
        toast.success("Todo updated");
      } else {
        //create
        await createTodo(values);
        toast.success("Todo created");
      }
      if (mutate) {
        console.log("mutttt");
        await mutate();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors: ", errors);
  };

  useEffect(() => {
    if (data) {
      const { title, description, completed } = data;
      reset({
        title,
        description,
        completed,
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (!id) {
      reset({
        title: "",
        description: "",
      });
    }
  }, [id, reset]);

  return (
    <div className="flex flex-col justify-center items-center p-5 bg-slate-100">
      <div className="my-5">
        <h2 className="text-xl">{title}</h2>
      </div>
      <div className="flex flex-col justify-center items-center p-5 gap-5">
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" {...register("title")} />
            <p className="error">{errors.title?.message}</p>
          </div>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <input type="text" id="description" {...register("description")} />
            <p className="error">{errors.description?.message}</p>
          </div>
          {mode === "update" && (
            <div className="form-control">
              <label htmlFor="completed">Is Todo Completed?</label>
              <input
                className="h-4 w-4"
                type="checkbox"
                id="completed"
                {...register("completed")}
              />

              <p className="error">{errors.completed?.message}</p>
            </div>
          )}
          <button disabled={isSubmitting} className="text-white">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
