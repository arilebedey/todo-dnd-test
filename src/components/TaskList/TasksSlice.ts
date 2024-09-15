import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskData {
  id: number;
  title: string;
  completed: boolean;
}

const initialState: TaskData[] = [
  {
    id: 0,
    title: "Showcase",
    completed: true,
  },
];

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
      const index = state.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
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
    reorderTask: (
      state,
      action: PayloadAction<{ formIndex: number; toIndex: number }>,
    ) => {
      const { formIndex: fromIndex, toIndex } = action.payload;
      const [movedTask] = state.splice(fromIndex, 1);
      state.splice(toIndex, 0, movedTask);
    },
  },
});

export const { addTask, removeTask, toggleTask, reorderTask, updateTask } =
  tasksSlice.actions;

export default tasksSlice.reducer;
