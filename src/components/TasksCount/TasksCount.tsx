import type { TasksData } from "../../components/TaskList/TasksSlice";

export const TasksCount = ({ items }: { items: TasksData }) => {
  let tasksHeader = "";

  if (items.name === "completed") {
    tasksHeader = `${items.data.length} completed task${items.data.length === 1 ? "" : "s"}`;
    if (items.data.length === 0) {
      tasksHeader = "Drop a task here to mark it complete.";
    }
  } else {
    tasksHeader = `${items.data.length} task${items.data.length === 1 ? "" : "s"} to do`;
    if (items.data.length === 0) {
      tasksHeader = "Drop a task here to undo its completion status.";
    }
  }

  return (
    <div className="flex items-center w-full pt-14">
      <span className="text-white text-left">{tasksHeader}</span>
    </div>
  );
};
