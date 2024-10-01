import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { PiTrashSimple } from "react-icons/pi";
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
} from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { removeTask, toggleTask } from "./TasksSlice";
import { FaCheck, FaExclamation } from "react-icons/fa";
import { TodoInput } from "../../widgets/TodoInput";

export const TaskList = () => {
  const tasks = useSelector((state: RootState) => state.task);
  const dispatch = useDispatch();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [editButtonClick, setEditButtonClick] = useState<{
    type: string;
    taskId: number | null;
  }>({ type: "", taskId: null });
  const [showError, setShowError] = useState(false);
  const [inputError, setInputError] = useState<{ message?: string }>({});
  const [isInputValid, setIsInputValid] = useState(Boolean);
  const [isEditTodoInputFocused, setIsEditTodoInputFocused] = useState(false);

  useEffect(() => {
    console.log(editButtonClick.taskId);
  }, [editButtonClick]);

  useEffect(() => {
    console.log(buttonRef);
  }, [buttonRef]);

  useEffect(() => {
    if (inputError) {
      setShowError(true);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [inputError]);

  if (tasks.length === 0) {
    return null;
  }

  const handleRemoveTask = (id: number) => {
    dispatch(removeTask(id));
  };

  const handleToggleTask = (id: number) => {
    dispatch(toggleTask(id));
  };

  return (
    <div className="w-full">
      <ul className="flex flex-col w-full">
        {tasks
          .slice()
          .reverse()
          .map((task) => (
            <div className="flex flex-col" key={task.id}>
              <div className="flex w-full min-h-[80px] items-center justify-between rounded-lg bg-theme-800 my-2">
                {task.id !== editButtonClick.taskId ? (
                  <li
                    className={`text-lg text-left ml-4 pr-4 py-3 ${task.completed ? "line-through text-green" : "text-theme-100"}`}
                  >
                    {task.title}
                  </li>
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
                    value={task.title}
                  />
                )}
                <div className="flex">
                  <button onClick={() => handleToggleTask(task.id)}>
                    {!task.completed ? (
                      <RiCheckboxBlankCircleLine className="size-5 text-theme-100 mr-4" />
                    ) : (
                      <RiCheckboxBlankCircleFill className="size-5 text-theme-100 mr-4" />
                    )}
                  </button>
                  {editButtonClick.taskId !== task.id && (
                    <button
                      ref={buttonRef}
                      onClick={() =>
                        setEditButtonClick({
                          type: "edit",
                          taskId: task.id,
                        })
                      }
                    >
                      <FiEdit3 className="size-5 text-theme-100 mr-4" />
                    </button>
                  )}
                  {editButtonClick.taskId === task.id && isInputValid && (
                    <button
                      ref={buttonRef}
                      onClick={() =>
                        setEditButtonClick({
                          type: "update",
                          taskId: task.id,
                        })
                      }
                    >
                      <FaCheck className="size-5 text-theme-100 mr-4" />
                    </button>
                  )}
                  {editButtonClick.taskId === task.id && !isInputValid && (
                    <button
                      ref={buttonRef}
                      onClick={() =>
                        setEditButtonClick({
                          type: "update",
                          taskId: task.id,
                        })
                      }
                    >
                      <FaExclamation className="size-5 text-red-700 mr-4" />
                    </button>
                  )}
                  <button onClick={() => handleRemoveTask(task.id)}>
                    <PiTrashSimple className="size-5 text-theme-100 mr-4 cursor-pointer" />
                  </button>
                </div>
              </div>
              {editButtonClick.taskId == task.id && showError && inputError && (
                <p className="text-red-500">{inputError.message}</p>
              )}
            </div>
          ))}
      </ul>
    </div>
  );
};
