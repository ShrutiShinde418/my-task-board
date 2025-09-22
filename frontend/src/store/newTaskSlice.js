import { createSlice } from "@reduxjs/toolkit";

const newTaskSlice = createSlice({
  name: "tasks",
  initialState: {
    showOffCanvas: false,
  },
  reducers: {
    openOffCanvas: (state) => {
      state.showOffCanvas = true;
    },
    closeOffCanvas: (state) => {
      state.showOffCanvas = false;
    },
  },
});

export default newTaskSlice.reducer;

export const { openOffCanvas, closeOffCanvas } = newTaskSlice.actions;
