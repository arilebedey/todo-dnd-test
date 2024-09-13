import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskData {
  id: number;
  title: string;
  completed: boolean;
}

const initialState: TaskData[] = [];

export const tasksSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<string>) => {
      state.push({
        id: Date.now(),
        completed: false,
        title: action.payload,
      });
    },
    removeTask: (state, action: PayloadAction<number>) => {
      return state.filter((task) => task.id !== action.payload);
    },
    toggleTask: (state, action: PayloadAction<number>) => {
      const task = state.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: number; title: string }>,
    ) => {
      const task = state.find((task) => task.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
      }
    },
    reoderTask: (
      state,
      action: PayloadAction<{ formIndex: number; toIndex: number }>,
    ) => {
      const { formIndex, toIndex } = action.payload;
      const [movedTask] = state.splice(formIndex, 1);
      state.splice(toIndex, 0, movedTask);
    },
  },
});

export const { addTask, removeTask, toggleTask } = tasksSlice.actions;

export default tasksSlice.reducer;
