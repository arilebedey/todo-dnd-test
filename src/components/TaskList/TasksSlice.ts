import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TasksData = {
  name: string;
  data: TaskData[];
};

export type TaskData = {
  id: number;
  title: string;
};

const initialState: TasksData[] = [
  {
    name: "notcompleted",
    data: [
      {
        id: 111111111111,
        title: "Share a moment",
      },
      {
        id: 222222222222,
        title: "Make some memories",
      },
    ],
  },
  {
    name: "completed",
    data: [
      {
        id: 333333333333,
        title: "Have a break",
      },
    ],
  },
];

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<string>) => {
      const notCompletedCategory = state.find(
        (category) => category.name === "notcompleted",
      );
      if (notCompletedCategory) {
        notCompletedCategory.data.unshift({
          id: Date.now(),
          title: action.payload,
        });
      }
    },
    removeTask: (
      state,
      action: PayloadAction<{ id: number; isCompleted: boolean }>,
    ) => {
      const category = action.payload.isCompleted ? state[1] : state[0];
      const index = category.data.findIndex(
        (task) => task.id === action.payload.id,
      );
      if (index !== -1) {
        category.data.splice(index, 1);
      }
    },
    toggleTask: (
      state,
      action: PayloadAction<{ id: number; isCompleted: boolean }>,
    ) => {
      const source = action.payload.isCompleted ? state[1] : state[0];
      const destination = action.payload.isCompleted ? state[0] : state[1];
      const index = source.data.findIndex(
        (task) => task.id === action.payload.id,
      );
      if (index !== -1) {
        const [toggledTask] = source.data.splice(index, 1);
        destination.data.splice(0, 0, toggledTask);
      }
    },
    updateTask: (
      state,
      action: PayloadAction<{
        id: number;
        title: string;
        isCompleted: boolean;
      }>,
    ) => {
      const category = action.payload.isCompleted ? state[1] : state[0];
      const index = category.data.findIndex(
        (task) => task.id === action.payload.id,
      );
      if (index !== -1) {
        category.data[index].title = action.payload.title;
      }
    },
    reorderTask: (
      state,
      action: PayloadAction<{
        fromIndex: number;
        toIndex: number;
        fromCategoryId: string;
        toCategoryId: string;
      }>,
    ) => {
      const { fromIndex, toIndex, fromCategoryId, toCategoryId } =
        action.payload;
      if (fromCategoryId === toCategoryId) {
        const category = state.find(
          (category) => category.name === fromCategoryId,
        );
        if (category) {
          const [movedTask] = category.data.splice(fromIndex, 1);
          category.data.splice(toIndex, 0, movedTask);
        }
      } else {
        const toCategory = state.find(
          (category) => category.name === toCategoryId,
        );
        const fromCategory = state.find(
          (category) => category.name === fromCategoryId,
        );
        if (toCategory && fromCategory) {
          const [movedTask] = fromCategory.data.splice(fromIndex, 1);
          toCategory.data.splice(toIndex, 0, movedTask);
        }
      }
    },
  },
});

export const { addTask, removeTask, toggleTask, reorderTask, updateTask } =
  tasksSlice.actions;

export default tasksSlice.reducer;
