import { useEffect, useRef, useState } from "react";
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
} from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { PiTrashSimple } from "react-icons/pi";
import { FaCheck, FaExclamation } from "react-icons/fa";
import { TodoInput } from "../../widgets/TodoInput";
import { removeTask, toggleTask } from "../TaskList/TasksSlice";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";

interface SortableTaskItemProps {
  task: {
    id: number;
    title: string;
    completed: boolean;
  };
  // isOverlay?: boolean;
}

export const SortableTaskItem = ({ task: item }: SortableTaskItemProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [editButtonClick, setEditButtonClick] = useState<{
    type: string;
    taskId: number | null;
  }>({ type: "", taskId: null });
  const [showError, setShowError] = useState(false);
  const [inputError, setInputError] = useState<{ message?: string }>({});
  const [isInputValid, setIsInputValid] = useState(Boolean);
  const [isEditTodoInputFocused, setIsEditTodoInputFocused] = useState(false);
  const dispatch = useDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  useEffect(() => {
    if (inputError) {
      setShowError(true);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [inputError]);

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemoveTask = (id: number) => {
    dispatch(removeTask(id));
  };

  const handleToggleTask = (id: number) => {
    dispatch(toggleTask(id));
  };

  const preventDragHandler = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <li
      className="flex flex-col touch-none"
      ref={setNodeRef}
      style={dndStyle}
      {...attributes}
      {...listeners}
    >
      <div
        className={`flex w-full min-h-[80px] items-center justify-between rounded-lg my-2 ${isDragging ? "bg-gray-500 text-transparent" : " bg-theme-800"}`}
      >
        {item.id !== editButtonClick.taskId ? (
          !isDragging ? (
            <p
              className={`text-lg text-left ml-4 pr-4 py-3 list-none ${item.completed ? "line-through text-green" : "text-theme-100"}`}
            >
              {item.title}
            </p>
          ) : null
        ) : (
          <TodoInput
            handler={2}
            placeholder="Вы редактируете задачу"
            onError={setInputError}
            onIsValid={setIsInputValid}
            inputFocusState={isEditTodoInputFocused}
            onInputFocus={setIsEditTodoInputFocused}
            formClassName="flex flex-grow px-3"
            inputClassName="flex-grow h-[40px] bg-theme-900 rounded-lg border border-gray px-3"
            buttonRef={buttonRef}
            TaskToEdit={editButtonClick}
            onSubmitEdit={setEditButtonClick}
            value={item.title}
          />
        )}
        {!isDragging ? (
          <div className="flex">
            <button
              onClick={() => handleToggleTask(item.id)}
              onPointerDown={(e) => preventDragHandler(e)}
              onTouchStart={(e) => preventDragHandler(e)}
            >
              {!item.completed ? (
                <RiCheckboxBlankCircleLine className="size-5 text-theme-100 mr-4" />
              ) : (
                <RiCheckboxBlankCircleFill className="size-5 text-theme-100 mr-4" />
              )}
            </button>
            {editButtonClick.taskId !== item.id && (
              <button
                ref={buttonRef}
                onClick={() =>
                  setEditButtonClick({
                    type: "edit",
                    taskId: item.id,
                  })
                }
                onPointerDown={(e) => preventDragHandler(e)}
                onTouchStart={(e) => preventDragHandler(e)}
              >
                <FiEdit3 className="size-5 text-theme-100 mr-4" />
              </button>
            )}
            {editButtonClick.taskId === item.id && isInputValid && (
              <button
                ref={buttonRef}
                onClick={() =>
                  setEditButtonClick({
                    type: "update",
                    taskId: item.id,
                  })
                }
                onPointerDown={(e) => preventDragHandler(e)}
                onTouchStart={(e) => preventDragHandler(e)}
              >
                <FaCheck className="size-5 text-theme-100 mr-4" />
              </button>
            )}
            {editButtonClick.taskId === item.id && !isInputValid && (
              <button
                ref={buttonRef}
                onClick={() =>
                  setEditButtonClick({
                    type: "update",
                    taskId: item.id,
                  })
                }
                onPointerDown={(e) => preventDragHandler(e)}
                onTouchStart={(e) => preventDragHandler(e)}
              >
                <FaExclamation className="size-5 text-red-700 mr-4" />
              </button>
            )}
            <button
              onClick={() => handleRemoveTask(item.id)}
              onPointerDown={(e) => preventDragHandler(e)}
              onTouchStart={(e) => preventDragHandler(e)}
            >
              <PiTrashSimple className="size-5 text-theme-100 mr-4 cursor-pointer" />
            </button>
          </div>
        ) : null}
      </div>
      {editButtonClick.taskId == item.id && showError && inputError && (
        <p className="text-red-500">{inputError.message}</p>
      )}
    </li>
  );
};
