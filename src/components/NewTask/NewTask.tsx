import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../TaskList/TasksSlice";

export const NewTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const dispatch = useDispatch();

  const handleUpdateTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(addTask(taskTitle));
    setTaskTitle("");
  };

  return (
    <form className="flex justify-center text-white w-full">
      <input
        type="text"
        placeholder="Новая задача"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className=" h-[40px] bg-theme-900 rounded-lg border border-theme-500 px-3 flex-grow"
      ></input>
      <button
        onClick={handleUpdateTask}
        className="bg-theme-100 text-white h-[40px] w-[40px] rounded-xl text-3xl font-light ml-4"
      >
        +
      </button>
    </form>
  );
};
