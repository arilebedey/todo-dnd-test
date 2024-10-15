import { useCallback, useEffect, useRef } from "react";

const DialogAcceptStatusEnum = {
  REJECTED: "rejected",
  PENDING: "pending",
  ACCEPTED: "accepted",
} as const;

type DialogAcceptStatus =
  (typeof DialogAcceptStatusEnum)[keyof typeof DialogAcceptStatusEnum];

interface TaskRemovalDialogProps {
  trigger: boolean;
  onUserChoice: (status: DialogAcceptStatus) => void;
}

export const TaskRemovalDialog = ({
  trigger,
  onUserChoice,
}: TaskRemovalDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleConfirm = () => {
    onUserChoice(DialogAcceptStatusEnum.ACCEPTED);
  };

  const handleCancel = useCallback(() => {
    onUserChoice(DialogAcceptStatusEnum.REJECTED);
    dialogRef.current?.close();
  }, [onUserChoice, dialogRef]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (trigger) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }

    const handleCancelByEsc = (e: Event) => {
      e.preventDefault();
      handleCancel();
    };

    dialog?.addEventListener("cancel", handleCancelByEsc);

    return () => {
      dialog?.removeEventListener("cancel", handleCancelByEsc);
    };
  }, [trigger, handleCancel]);

  return (
    <div className="fixed">
      <dialog className="rounded-lg p-7 bg-theme-100" ref={dialogRef}>
        <p>Are you sure you want to delete this task?</p>
        <div className="flex justify-end mt-4">
          <button
            className="mr-2 px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={handleConfirm}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </dialog>
    </div>
  );
};
