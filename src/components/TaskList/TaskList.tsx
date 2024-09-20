import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { PiTrashSimple } from "react-icons/pi";
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
} from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { removeTask, toggleTask, updateTask } from "./TasksSlice";
import { FaCheck } from "react-icons/fa";

export const TaskList = () => {
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [inputEditTask, setInputEditTask] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const tasks = useSelector((state: RootState) => state.task);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editTaskId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editTaskId]);

  if (tasks.length === 0) {
    return null;
  }

  const handleRemoveTask = (id: number) => {
    dispatch(removeTask(id));
  };

  const handleToggleTask = (id: number) => {
    dispatch(toggleTask(id));
  };

  const handleUpdateTask = (id: number) => {
    if (inputEditTask.trim() === "") {
      dispatch(removeTask(id));
    } else {
      dispatch(updateTask({ id, title: inputEditTask }));
    }
    setEditTaskId(null);
  };

  const handleEditTaskButton = (task: { title: string; id: number }) => {
    if (editTaskId == null) {
      setInputEditTask(task.title);
      setEditTaskId(task.id);
    } else {
      alert(
        `Please finish editing the task currently titled "${inputEditTask}"`,
      );
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    taskId: number,
  ) => {
    if (e.key === "Enter") {
      handleUpdateTask(taskId);
    }
  };

  // Once the edit button on a task was pressed a checkmark to save changes will appear until it is pressed or enter is hit inside input
  const handleConfirmButton = (taskId: number) => {
    handleUpdateTask(taskId);
  };

  return (
    <div className="w-full">
      <ul className="flex flex-col w-full">
        {tasks.map((task) => (
          <div
            className="flex w-full min-h-[80px] items-center justify-between rounded-lg bg-theme-800 my-2"
            key={task.id}
          >
            {task.id !== editTaskId ? (
              <li
                className={`text-lg text-left ml-4 pr-4 py-3 ${task.completed ? "line-through text-green" : "text-theme-100"}`}
              >
                {task.title}
              </li>
            ) : (
              <input
                ref={inputRef}
                type="text"
                placeholder="Input task edit here"
                value={inputEditTask}
                onChange={(e) => setInputEditTask(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, task.id)}
                className=" min-h-[40px] bg-transparent rounded-lg border border-theme-500 mx-3 pl-3 flex-grow"
              ></input>
            )}
            <div className="flex">
              <button onClick={() => handleToggleTask(task.id)}>
                {!task.completed ? (
                  <RiCheckboxBlankCircleLine className="size-5 text-theme-100 mr-4" />
                ) : (
                  <RiCheckboxBlankCircleFill className="size-5 text-theme-100 mr-4" />
                )}
              </button>
              {editTaskId !== task.id ? (
                <button onClick={() => handleEditTaskButton(task)}>
                  <FiEdit3 className="size-5 text-theme-100 mr-4" />
                </button>
              ) : (
                <button onClick={() => handleConfirmButton(task.id)}>
                  <FaCheck className="size-5 text-theme-100 mr-4" />
                </button>
              )}
              <button onClick={() => handleRemoveTask(task.id)}>
                <PiTrashSimple className="size-5 text-theme-100 mr-4 cursor-pointer" />
              </button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};
