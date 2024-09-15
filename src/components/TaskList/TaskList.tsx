import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { PiTrashSimple } from "react-icons/pi";
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
} from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { removeTask, toggleTask } from "./TasksSlice";

export const TaskList = () => {
  const tasks = useSelector((state: RootState) => state.task || []);
  const dispatch = useDispatch();

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
        {tasks.map((task) => (
          <div
            className="flex w-full min-h-[80px] items-center justify-between rounded-lg bg-theme-800 my-2"
            key={task.id}
          >
            <li
              className={`text-lg text-left ml-4 pr-4 py-3 ${task.completed ? "line-through text-green" : "text-theme-100"}`}
            >
              {task.title}
            </li>
            <div className="flex">
              <button onClick={() => handleToggleTask(task.id)}>
                {!task.completed ? (
                  <RiCheckboxBlankCircleLine className="size-5 text-theme-100 mr-4" />
                ) : (
                  <RiCheckboxBlankCircleFill className="size-5 text-theme-100 mr-4" />
                )}
              </button>
              <button>
                <FiEdit3 className="size-5 text-theme-100 mr-4" />
              </button>
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
