import type { TaskData } from "../../components/TaskList/TasksSlice";

export const TasksCount = ({ items }: { items: TaskData[] }) => {
  let numberOfTasks = 0;
  let tasksCount = "";

  if (items.some((item) => item.completed)) {
    const complete = items.filter((task) => task.completed === true);
    numberOfTasks = complete.length;
    tasksCount = "Завершено - " + complete.length;
  } else {
    const notComplete = items.filter((task) => task.completed !== true);
    numberOfTasks = notComplete.length;
    tasksCount = "Список дел - " + notComplete.length;
  }

  return (
    <div className="flex items-center w-full pt-14">
      {numberOfTasks !== 0 ? (
        <span className="text-white text-left">{tasksCount}</span>
      ) : (
        <span className="text-white text-left">Drop task here</span>
      )}
    </div>
  );
};
