import { configureStore } from "@reduxjs/toolkit";
import tasksSlice from "./tasksSlice.js";
import userSlice from "./userSlice.js";

const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    user: userSlice,
  },
});

export default store;
