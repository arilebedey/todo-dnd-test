import { useDispatch } from "react-redux";
import { addTask } from "../TaskList/TasksSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

interface FormData {
  newTask: string;
}

export const NewTask = () => {
  const dispatch = useDispatch();

  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [isTaskEmpty, setIsTaskEmpty] = useState(true);

  const watchNewTask = watch("newTask", "");

  useEffect(() => {
    if (watchNewTask === "") {
      setIsTaskEmpty(true);
    } else {
      setIsTaskEmpty(false);
    }
  }, [watchNewTask]);

  const handleUpdateTask: SubmitHandler<FormData> = (data) => {
    dispatch(addTask(data.newTask));
    reset();
  };

  return (
    <form
      className="flex justify-center text-white w-full flex-col"
      onSubmit={handleSubmit(handleUpdateTask)}
    >
      <div className="flex relative">
        <input
          type="text"
          placeholder="Новая задача"
          className="flex justify-center w-full h-[40px] bg-theme-900 rounded-lg border border-theme-500 px-3 flex-grow"
          {...register("newTask", {
            required: "Task is required",
            pattern: {
              value: /^[A-Za-z]*$/,
              message: "Task must contain at least one alphabetic letter",
            },
          })}
        ></input>
        <button
          type="submit"
          className={`text-white h-[40px] w-[40px] rounded-xl text-3xl font-light ml-4 ${
            isTaskEmpty
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-theme-100 cursor-pointer"
          }`}
        >
          +
        </button>
      </div>
      {errors.newTask && (
        <p className="text-red-500 mt-2 absolute top-36 self-center">
          {errors.newTask.message}
        </p>
      )}
    </form>
  );
};
