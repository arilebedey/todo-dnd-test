import { useDispatch } from "react-redux";
import { addTask } from "../TaskList/TasksSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

interface FormData {
  newTask: string;
}

export const NewTask = () => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showError, setShowError] = useState(false);
  const [refocusInputTrigger, setRefocusInputTrigger] = useState(false);

  const {
    reset,
    trigger,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
  });

  useEffect(() => {
    if (errors.newTask) {
      setShowError(true);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [errors.newTask]);

  useEffect(() => {
    if (refocusInputTrigger) {
      inputRef.current?.focus();
      setIsInputFocused(true);
      setRefocusInputTrigger(false);
    }
  }, [refocusInputTrigger]);

  const { ref: HookFormRef, ...rest } = register("newTask", {
    required: "Task is required",
    pattern: {
      value: /^(?=.*[A-Za-z]).*$/,
      message: "Task must contain at least one alphabetic letter",
    },
  });

  const handleButtonClick = async () => {
    if (inputRef.current && inputRef.current.value.trim() === "") {
      if (!isInputFocused) {
        reset();
        inputRef.current.focus();
        return;
      }

      // This is needed to trigger validation on an empty input without
      // because `handleSubmit(handleUpdateTask)` doesn't validate on empty
      // input unless it's in the form's `onSubmit (i.e. triggered by Enter key)`
      const isValidForm = await trigger("newTask");

      if (!isValidForm) {
        // This allows mimicking the UX of Enter key, which displays error
        // while keeping input focused
        setRefocusInputTrigger(true);
      } else {
        handleSubmit(handleUpdateTask)();
      }
    } else {
      handleSubmit(handleUpdateTask)();
    }
  };

  const handleInputFocus = () => {
    if (refocusInputTrigger) {
      // handled in useEffect
      return;
    }
    if (inputRef.current && inputRef.current.value.trim() === "") {
      reset();
      setIsInputFocused(true);
    }
  };

  const handleUpdateTask: SubmitHandler<FormData> = (data) => {
    dispatch(addTask(data.newTask));
    reset();
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // If the focus is moving from input to the **submit** button, bypass `setIsInputFocused(false);`,
    // so that the input is not forever refocused back on the button click
    // Enables validation logic in handleButtonClick to go through
    if (event.relatedTarget === buttonRef.current) {
      return;
    }
    setIsInputFocused(false);
  };

  return (
    <form
      className="flex justify-center text-white w-full flex-col mt-20 relative"
      onSubmit={handleSubmit(handleUpdateTask)}
    >
      <div className="flex flex-grow">
        <input
          type="text"
          placeholder="Новая задача"
          className="flex-grow h-[40px] bg-theme-900 rounded-lg border border-theme-500 px-3"
          {...rest}
          ref={(e) => {
            HookFormRef(e);
            inputRef.current = e;
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        ></input>
        <button
          type="button"
          className={`cursor-pointer text-white h-[40px] w-[40px] rounded-xl text-3xl font-light ml-4 ${
            isInputFocused || isValid ? "bg-theme-100" : "bg-gray-400"
          }`}
          onClick={handleButtonClick}
          ref={buttonRef}
        >
          +
        </button>
      </div>
      {showError && errors.newTask && (
        <p className="text-red-500 mt-2 absolute top-[45px] self-center">
          {errors.newTask.message}
        </p>
      )}
    </form>
  );
};
