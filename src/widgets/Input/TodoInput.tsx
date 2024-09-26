import { SubmitHandler, useForm } from "react-hook-form";
import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { addTask, updateTask } from "../../components/TaskList/TasksSlice";

interface FormData {
  newTask: string;
}

type TodoInputProps = {
  placeholder: string;
  inputClassName?: string;
  formClassName?: string;
  buttonRef: React.RefObject<HTMLButtonElement>;
  setError: (error: object) => void;
  setIsValid: (isValid: boolean) => void;
  setIsInputFocused: (isInputFocused: boolean) => void;
  isInputFocused: boolean;
  handler: number;
};

export const TodoInput: React.FC<TodoInputProps> = ({
  placeholder,
  inputClassName,
  formClassName,
  buttonRef,
  setError,
  setIsValid,
  setIsInputFocused,
  isInputFocused,
  handler,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [refocusInputTrigger, setRefocusInputTrigger] = useState(false);
  const dispatch = useDispatch();

  const {
    reset,
    trigger,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
  });

  const handleAddTask: SubmitHandler<FormData> = useCallback(
    (data) => {
      dispatch(addTask(data.newTask));
      reset();
    },
    [dispatch, reset],
  );

  const handleUpdateTask: SubmitHandler<FormData> = useCallback(
    (data) => {
      // dispatch(updateTask({data.id, data.newTask}));
      dispatch(addTask(data.newTask));
      reset();
    },
    [reset, dispatch],
  );

  const getDispatchHandler = useCallback(
    (handler: number) => {
      if (handler === 1) {
        return handleAddTask;
      }
      if (handler === 2) {
        return handleUpdateTask;
      }
      return () => {};
    },
    [handleAddTask, handleUpdateTask],
  );

  useEffect(() => {
    if (refocusInputTrigger) {
      inputRef.current?.focus();
      setIsInputFocused(true);
      setRefocusInputTrigger(false);
    }
  }, [refocusInputTrigger, setIsInputFocused]);

  useEffect(() => {
    if (errors.newTask) {
      setError(errors.newTask);
    }
  }, [errors.newTask, setError]);

  useEffect(() => {
    setIsValid(isValid);
  }, [isValid, setIsValid]);

  const { ref: HookFormRef, ...rest } = register("newTask", {
    required: "Task is required",
    pattern: {
      value: /^(?=.*[A-Za-z]).*$/,
      message: "Task must contain at least one alphabetic letter",
    },
  });

  const handleButtonClickWrapper = useCallback(async () => {
    if (inputRef.current && inputRef.current.value.trim() === "") {
      if (!isInputFocused) {
        reset();
        inputRef.current.focus();
        setIsInputFocused(true);
        return;
      }

      const isValidForm = await trigger("newTask");

      if (!isValidForm) {
        setRefocusInputTrigger(true);
      }
    } else {
      handleSubmit(getDispatchHandler(handler))();
    }
  }, [
    setIsInputFocused,
    isInputFocused,
    reset,
    trigger,
    handleSubmit,
    getDispatchHandler,
    handler,
  ]);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.addEventListener("click", handleButtonClickWrapper);
    }

    const currentButton = buttonRef.current;

    return () => {
      if (currentButton) {
        currentButton.removeEventListener("click", handleButtonClickWrapper);
      }
    };
  }, [buttonRef, isInputFocused, handleButtonClickWrapper]);

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

  const handleInputBlur = (
    event: React.FocusEvent<HTMLInputElement>,
    currentButtonRef: React.RefObject<HTMLButtonElement>,
  ) => {
    // If the focus is moving from input to the **submit** button, bypass `setIsInputFocused(false);`,
    // so that the input is not forever refocused back on the button click
    // Enables validation logic in handleButtonClick to go through
    if (event.relatedTarget === currentButtonRef.current) {
      return;
    }
    setIsInputFocused(false);
  };

  return (
    <>
      <form
        className={clsx("", formClassName)}
        onSubmit={handleSubmit(getDispatchHandler(handler))}
      >
        <input
          type="text"
          placeholder={placeholder}
          className={clsx("", inputClassName)}
          {...rest}
          ref={(e) => {
            HookFormRef(e);
            inputRef.current = e;
          }}
          onFocus={handleInputFocus}
          onBlur={(e) => handleInputBlur(e, buttonRef)}
        ></input>
      </form>
    </>
  );
};
