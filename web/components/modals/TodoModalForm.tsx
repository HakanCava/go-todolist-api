import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState,
} from "react";
import { Button } from "../ui/button";

export type ModalProps = {
  title?: string;
  onAction?: VoidFunction;
  actionTitle?: string;
  cancelTitle?: string;
  form?: ReactNode;
  message?: string;
  shouldBeClosedOutside?: boolean;
};

export interface ModalRef {
  show: (options?: ModalProps) => void;
  close?: VoidFunction;
}

const TodoModalForm = forwardRef<ModalRef, object>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalProps | undefined>(
    undefined
  );

  useImperativeHandle(ref, () => ({
    close: () => setIsOpen(false),
    show: (options?: ModalProps) => {
      setIsOpen(true);
      setModalOptions(options);
    },
  }));

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="flex top-0 left-0 fixed w-full h-full bg-[rgba(0,0,0,0.4)] z-30 overflow-hidden select-none"
      onClick={() => modalOptions?.shouldBeClosedOutside && setIsOpen(false)}
    >
      <div
        className="flex flex-col absolute top-1/2 left-1/2 sm:w-80 md:w-96 lg:w-[600px] z-40 transform -translate-x-1/2 -translate-y-1/2"
        onClick={(e) => e.stopPropagation()}
      >
        {modalOptions?.title && (
          <div className="w-full z-50 h-6 py-5 text-center">
            <span className="w-full text-lg">{modalOptions?.title}</span>
          </div>
        )}
        {modalOptions?.message && (
          <div className="w-full z-50 py-5">
            <span className="w-full text-sm">{modalOptions?.message}</span>
          </div>
        )}
        {modalOptions?.form && (
          <div className="w-full z-50">
            <div>{modalOptions?.form}</div>
          </div>
        )}
        {(modalOptions?.actionTitle || modalOptions?.actionTitle) && (
          <div className="flex justify-center items-center w-full h-20 py-5">
            {modalOptions?.actionTitle && (
              <Button>{modalOptions?.actionTitle}</Button>
            )}
            {modalOptions?.actionTitle && (
              <Button
                onClick={() =>
                  modalOptions?.onAction && modalOptions?.onAction()
                }
              >
                {modalOptions?.actionTitle}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

TodoModalForm.displayName = "TodoModalForm";

export default TodoModalForm;
