import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../components/TaskList/TasksSlice";

export const store = configureStore({
  reducer: {
    // When we pass in an object like `{task: tasksReducer}`, that says
    // that we want to have a `state.task` section of our Redux state object,
    // and that we want the `tasksReducer` function to be in charge of
    // deciding if and how to update the `state.counter` section whenever an action is dispatched.
    task: taskReducer,
  },
});

// From docs
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
