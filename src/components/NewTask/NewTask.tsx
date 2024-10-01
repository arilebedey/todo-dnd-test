import { useEffect, useRef, useState } from "react";
import { TodoInput } from "../../widgets/TodoInput";

export const NewTask = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [showError, setShowError] = useState(false);
  const [inputError, setInputError] = useState<{ message?: string }>({});
  const [isInputValid, setIsInputValid] = useState(Boolean);
  const [isAddTodoInputFocused, setIsAddTodoInputFocused] = useState(false);

  useEffect(() => {
    if (inputError) {
      setShowError(true);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [inputError]);

  return (
    <div className="flex justify-center text-white w-full mt-20 relative">
      <TodoInput
        handler={1}
        onIsValid={setIsInputValid}
        onError={setInputError}
        buttonRef={buttonRef}
        placeholder="Новая задача"
        onInputFocus={setIsAddTodoInputFocused}
        inputFocusState={isAddTodoInputFocused}
        formClassName="flex flex-grow"
        inputClassName="flex-grow h-[40px] bg-theme-900 rounded-lg border border-theme-500 px-3"
      />
      {showError && inputError && (
        <p className="text-red-500 mt-2 absolute top-[45px]">
          {inputError.message}
        </p>
      )}
      <button
        type="button"
        className={`cursor-pointer text-white h-[40px] w-[40px] rounded-xl text-3xl font-light ml-4 ${
          isAddTodoInputFocused || isInputValid ? "bg-theme-100" : "bg-gray-400"
        }`}
        ref={buttonRef}
      >
        +
      </button>
    </div>
  );
};
