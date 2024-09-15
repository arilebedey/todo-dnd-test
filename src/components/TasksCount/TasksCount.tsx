import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export const TasksCount = () => {
  const tasksLength = useSelector((state: RootState) => {
    const notComplete = state.task.filter((task) => task.completed !== true);
    return notComplete.length;
  });

  return (
    <div className="flex items-center w-full pt-14">
      <span className="text-white text-left">Список дел - {tasksLength}</span>
    </div>
  );
};
