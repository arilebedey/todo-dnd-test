import { useRef, useState, useEffect } from "react";
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
} from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { PiTrashSimple } from "react-icons/pi";
import { FaCheck, FaExclamation } from "react-icons/fa";
import { TodoInput } from "../../widgets/TodoInput";
import { useDispatch } from "react-redux";
import { removeTask, TaskData, toggleTask } from "../TaskList/TasksSlice";

interface SortableTaskItemProps {
  task: TaskData;
  provided: any;
  snapshot: any;
  categoryId: string;
}

export const SortableTaskItem = ({
  task: item,
  provided,
  snapshot,
  categoryId,
}: SortableTaskItemProps) => {
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

  useEffect(() => {
    if (inputError) {
      setShowError(true);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [inputError]);

  const handleRemoveTask = (id: number, isCompleted: boolean) => {
    dispatch(removeTask({ id, isCompleted }));
  };

  const handleToggleTask = (id: number, isCompleted: boolean) => {
    dispatch(toggleTask({ id, isCompleted }));
  };

  const preventDragHandler = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  const isCompleted = categoryId === "completed";

  return (
    <li
      className="flex flex-col touch-none"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        ...provided.draggableProps.style,
        opacity: snapshot.isDragging ? 0.8 : 1,
      }}
    >
      <div
        className={`flex w-full min-h-[80px] items-center justify-between rounded-lg my-2 ${snapshot.isDragging ? "bg-gray-500" : "bg-theme-800"}`}
      >
        {item.id !== editButtonClick.taskId ? (
          <p
            className={`text-lg text-left ml-4 pr-4 py-3 list-none ${isCompleted ? "line-through text-green" : "text-theme-100"}`}
          >
            {item.title}
          </p>
        ) : (
          <TodoInput
            handler={2}
            placeholder="You are editing this task"
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
            completionStatus={isCompleted}
          />
        )}
        <div className="flex">
          <button
            onClick={() => handleToggleTask(item.id, isCompleted)}
            onPointerDown={(e) => preventDragHandler(e)}
            onTouchStart={(e) => preventDragHandler(e)}
          >
            {!isCompleted ? (
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
            onClick={() => handleRemoveTask(item.id, isCompleted)}
            onPointerDown={(e) => preventDragHandler(e)}
            onTouchStart={(e) => preventDragHandler(e)}
          >
            <PiTrashSimple className="size-5 text-theme-100 mr-4 cursor-pointer" />
          </button>
        </div>
      </div>
      {editButtonClick.taskId == item.id && showError && inputError && (
        <p className="text-red-700">{inputError.message}</p>
      )}
    </li>
  );
};
