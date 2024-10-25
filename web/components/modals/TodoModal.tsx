"use client";
import React, { FC, PropsWithChildren, ReactNode, useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

interface TodoModalProps extends PropsWithChildren {
  onAction?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title?: string;
  description?: string;
  actionButtonTitle?: string;
  cancelButtonTitle?: string;
  form?: ReactNode;
}

export const TodoModal: FC<TodoModalProps> = ({
  children,
  onAction,
  title,
  description,
  actionButtonTitle,
  cancelButtonTitle,
  form,
}) => {
  const [open, setOpen] = useState(false);
  const handleAction = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (onAction) {
      onAction(e);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          {!cancelButtonTitle && (
            <X
              className="h-6 w-6 text-red-600 rounded-sm cursor-pointer border border-gray-400 bg-slate-200"
              onClick={() => setOpen(false)}
            />
          )}
        </AlertDialogHeader>
        {form && form}
        <AlertDialogFooter>
          {cancelButtonTitle && (
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              {cancelButtonTitle}
            </AlertDialogCancel>
          )}
          {actionButtonTitle && (
            <AlertDialogAction onClick={handleAction}>
              {actionButtonTitle}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
