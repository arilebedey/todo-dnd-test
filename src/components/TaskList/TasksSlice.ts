import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TaskData = {
  id: number;
  title: string;
  completed: boolean;
};

const initialState: TaskData[] = [
  {
    id: 3,
    title: "Surf",
    completed: true,
  },
  {
    id: 2,
    title: "Share with someone",
    completed: true,
  },
  {
    id: 1,
    title: "Make more money",
    completed: false,
  },
];

export const tasksSlice = createSlice({
  name: "tasks",
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
      action: PayloadAction<{ fromId: number; toId: number }>,
    ) => {
      const { fromId, toId } = action.payload;

      const fromIndex = state.findIndex((task) => task.id === fromId);
      const toIndex = state.findIndex((task) => task.id === toId);

      if (fromIndex === -1 || toIndex === -1) return;

      const [movedTask] = state.splice(fromIndex, 1);
      state.splice(toIndex, 0, movedTask);
    },
  },
});

export const { addTask, removeTask, toggleTask, reorderTask, updateTask } =
  tasksSlice.actions;

export default tasksSlice.reducer;
