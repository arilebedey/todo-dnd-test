import { useDispatch } from "react-redux";
import { addTask } from "../TaskList/TasksSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRef, useState } from "react";

interface FormData {
  newTask: string;
}

export const NewTask = () => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
  });

  const { ref: HookFormRef, ...rest } = register("newTask", {
    required: "Task is required",
    pattern: {
      value: /^(?=.*[A-Za-z]).*$/,
      message: "Task must contain at least one alphabetic letter",
    },
  });

  const handleButtonClick = () => {
    if (inputRef.current && inputRef.current.value.trim() === "") {
      reset();
      inputRef.current.focus();
    } else {
      handleSubmit(handleUpdateTask)();
    }
  };

  const handleInputFocus = () => {
    if (inputRef.current && inputRef.current.value.trim() === "") {
      reset();
    }
    setIsInputFocused(true);
  };

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
          {...rest}
          ref={(e) => {
            HookFormRef(e);
            inputRef.current = e;
          }}
          onFocus={handleInputFocus}
          onBlur={() => setIsInputFocused(false)}
        ></input>
        <button
          type="button"
          className={`cursor-pointer text-white h-[40px] w-[40px] rounded-xl text-3xl font-light ml-4 ${
            isInputFocused || isValid ? "bg-theme-100" : "bg-gray-400"
          }`}
          onClick={handleButtonClick}
        >
          +
        </button>
      </div>
      {errors.newTask && isInputFocused && (
        <p className="text-red-500 mt-2 absolute top-36 self-center">
          {errors.newTask.message}
        </p>
      )}
    </form>
  );
};
