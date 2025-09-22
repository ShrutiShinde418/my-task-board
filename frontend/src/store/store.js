import { configureStore } from "@reduxjs/toolkit";
import newTaskSlice from "./newTaskSlice.js";

const store = configureStore({
  reducer: {
    tasks: newTaskSlice,
  },
});

export default store;
