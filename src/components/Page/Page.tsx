import { NewTask } from "../NewTask";
import { TaskList } from "../TaskList";

export const Page = () => {
  return (
    <div className="flex flex-col justify-center items-center w-[400px] h-max mx-auto mt-24">
      <NewTask />
      <TaskList />
    </div>
  );
};
