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
  inputClassName: string;
  formClassName: string;
  onError: (error: object) => void;
  onIsValid: (isValid: boolean) => void;
  handler: number;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  onInputFocus: (inputFocusState: boolean) => void;
  inputFocusState: boolean;
  TaskToEdit?: { type: string; taskId: number | null };
  onSubmitEdit?: (params: { type: string; taskId: number | null }) => void;
  value?: string;
  completionStatus?: boolean;
};

export const TodoInput: React.FC<TodoInputProps> = ({
  placeholder,
  inputClassName,
  formClassName,
  buttonRef,
  onError,
  onIsValid,
  onInputFocus,
  inputFocusState,
  handler,
  onSubmitEdit,
  TaskToEdit,
  value,
  completionStatus,
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
      if (
        TaskToEdit?.taskId !== undefined &&
        TaskToEdit.taskId !== null &&
        onSubmitEdit &&
        completionStatus !== undefined
      ) {
        dispatch(
          updateTask({
            id: TaskToEdit?.taskId,
            title: data.newTask,
            isCompleted: completionStatus,
          }),
        );
        onSubmitEdit({ type: TaskToEdit.type, taskId: null });
        reset();
      }
    },
    [reset, dispatch, TaskToEdit, onSubmitEdit, completionStatus],
  );

  const dispatchHandler = useCallback(
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
    inputRef.current?.focus();
    onInputFocus(true);
    if (refocusInputTrigger) {
      inputRef.current?.focus();
      onInputFocus(true);
      setRefocusInputTrigger(false);
    }
  }, [refocusInputTrigger, onInputFocus]);

  useEffect(() => {
    if (errors.newTask) {
      onError(errors.newTask);
    }
  }, [errors.newTask, onError]);

  useEffect(() => {
    onIsValid(isValid);
  }, [isValid, onIsValid]);

  const { ref: HookFormRef, ...rest } = register("newTask", {
    required: "Task is required",
    pattern: {
      value: /^(?=.*[A-Za-z]).*$/,
      message: "Task must contain at least one alphabetic letter",
    },
  });

  const handleButtonClickWrapper = useCallback(async () => {
    const isValidForm = await trigger("newTask");

    if (!isValidForm) {
      setRefocusInputTrigger(true);
    } else {
      handleSubmit(dispatchHandler(handler))();
    }
  }, [setRefocusInputTrigger, dispatchHandler, handleSubmit, handler, trigger]);

  const handleButtonClickCheckFocusWrapper = useCallback(async () => {
    if (inputRef.current && inputRef.current.value.trim() === "") {
      if (!inputFocusState) {
        reset();
        inputRef.current.focus();
        onInputFocus(true);
        return;
      }

      // This is needed to trigger validation on an empty input
      // because `handleSubmit(handleUpdateTask)` doesn't validate on empty
      // input unless it's triggered by Enter key
      const isValidForm = await trigger("newTask");

      if (!isValidForm) {
        setRefocusInputTrigger(true);
      }
    } else {
      handleSubmit(dispatchHandler(handler))();
    }
  }, [
    onInputFocus,
    inputFocusState,
    reset,
    trigger,
    handleSubmit,
    dispatchHandler,
    handler,
  ]);

  useEffect(() => {
    const currentButton = buttonRef?.current;

    if (currentButton && handler === 2) {
      currentButton.addEventListener("click", handleButtonClickWrapper);
    }
    return () => {
      if (currentButton) {
        currentButton.removeEventListener("click", handleButtonClickWrapper);
      }
    };
  }, [buttonRef, handleButtonClickWrapper, handler]);

  useEffect(() => {
    const currentButton = buttonRef?.current;
    if (currentButton && handler === 1) {
      currentButton.addEventListener(
        "click",
        handleButtonClickCheckFocusWrapper,
      );
    }
    return () => {
      if (currentButton) {
        currentButton.removeEventListener(
          "click",
          handleButtonClickCheckFocusWrapper,
        );
      }
    };
  }, [buttonRef, handleButtonClickCheckFocusWrapper, handler]);

  useEffect(() => {
    if (TaskToEdit?.type === "update") {
      handleButtonClickWrapper();
    }
  }, [TaskToEdit, handleButtonClickWrapper]);

  const handleInputFocus = () => {
    if (refocusInputTrigger) {
      // handled in useEffect
      return;
    }
    if (inputRef.current && inputRef.current.value.trim() === "") {
      reset();
      onInputFocus(true);
    }
  };

  const handleInputBlur = (
    event: React.FocusEvent<HTMLInputElement>,
    currentButtonRef: React.RefObject<HTMLButtonElement> | undefined,
  ) => {
    // If the focus is moving from input to the **submit** button, bypass `setIsInputFocused(false);`,
    // so that the input is not forever refocused back on the button click
    // Enables validation logic in handleButtonClick to go through
    if (currentButtonRef && event.relatedTarget === currentButtonRef.current) {
      return;
    }
    onInputFocus(false);
  };

  const preventDragHandler = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <>
      <form
        className={clsx("", formClassName)}
        onSubmit={handleSubmit(dispatchHandler(handler))}
      >
        <input
          type="text"
          placeholder={placeholder}
          defaultValue={value ? value : ""}
          className={clsx("", inputClassName)}
          autoComplete="off"
          {...rest}
          ref={(e) => {
            HookFormRef(e);
            inputRef.current = e;
          }}
          onFocus={handleInputFocus}
          onBlur={(e) => handleInputBlur(e, buttonRef)}
          onPointerDown={(e) => preventDragHandler(e)}
          onTouchStart={(e) => preventDragHandler(e)}
        ></input>
      </form>
    </>
  );
};
