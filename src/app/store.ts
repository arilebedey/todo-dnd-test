import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../components/TaskList/TasksSlice";

export const store = configureStore({
  reducer: {
    task: taskReducer,
  },
});

// From docs
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
