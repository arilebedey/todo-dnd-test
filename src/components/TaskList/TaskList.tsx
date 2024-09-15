import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { PiTrashSimple } from "react-icons/pi";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";

export const TaskList = () => {
  const tasks = useSelector((state: RootState) => state.task || []);

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <ul className="flex flex-col w-full">
        {tasks.map((task) => (
          <div className="flex w-full min-h-[80px] items-center justify-between rounded-lg bg-theme-800 my-2">
            <li
              className="text-lg text-theme-100 text-left ml-4 pr-4 py-3"
              key={task.id}
            >
              {task.title}
            </li>
            <div className="flex">
              <RiCheckboxBlankCircleLine className="size-5 text-theme-100 mr-4" />
              <FiEdit3 className="size-5 text-theme-100 mr-4" />
              <PiTrashSimple className="size-5 text-theme-100 mr-4" />
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};
