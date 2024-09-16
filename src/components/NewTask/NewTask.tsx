import { useDispatch } from "react-redux";
import { addTask } from "../TaskList/TasksSlice";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  newTask: string;
}

export const NewTask = () => {
  const dispatch = useDispatch();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

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
            // pattern: {
            //   value: /^[A-Za-z]*$/,
            //   message: "Task must contain at least one alphabetic letter",
            // },
          })}
        ></input>
        <button
          type="submit"
          className="bg-theme-100 text-white h-[40px] w-[40px] rounded-xl text-3xl font-light ml-4"
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
