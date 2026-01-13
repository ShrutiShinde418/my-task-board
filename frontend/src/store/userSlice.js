import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    activeBoard: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setActiveBoard: (state, action) => {
      state.activeBoard = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setUser, setActiveBoard } = userSlice.actions;
