import { createSlice } from "@reduxjs/toolkit";
import { taskHeaders } from "../utils/helpers.js";

const initialTaskStoreState = taskHeaders.reduce((acc, taskHeader) => {
  return {
    ...acc,
    [taskHeader.prop]: [],
  };
}, {});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    showOffCanvas: false,
    taskStore: initialTaskStoreState,
    taskToUpdate: null,
  },
  reducers: {
    openOffCanvas: (state) => {
      state.showOffCanvas = true;
    },
    closeOffCanvas: (state) => {
      state.showOffCanvas = false;
    },
    addTask: (state, action) => {
      state.taskStore = {
        ...state.taskStore,
        [action.payload.type]: [
          ...state.taskStore[action.payload.type],
          action.payload.task,
        ],
      };
    },
    updateTaskStore: (state, action) => {
      if (action.payload?.length > 0) {
        state.taskStore = action.payload?.reduce((acc, task) => {
          const status = task.status;
          if (!acc[status]) {
            acc[status] = [];
          }
          acc[status].push(task);
          return acc;
        }, {});
      }
    },
    setTaskToUpdate: (state, action) => {
      state.taskToUpdate = action.payload;
    },
  },
});

export default tasksSlice.reducer;

export const {
  openOffCanvas,
  closeOffCanvas,
  addTask,
  updateTaskStore,
  setTaskToUpdate,
} = tasksSlice.actions;
