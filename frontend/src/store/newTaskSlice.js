import { createSlice } from "@reduxjs/toolkit";
import { taskHeaders } from "../utils/helpers.js";

const newTaskSlice = createSlice({
  name: "tasks",
  initialState: {
    showOffCanvas: false,
    taskStore: taskHeaders.reduce((acc, taskHeader) => {
      acc[taskHeader.prop] = [];

      return acc;
    }, {}),
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
  },
});

export default newTaskSlice.reducer;

export const { openOffCanvas, closeOffCanvas, addTask } = newTaskSlice.actions;
