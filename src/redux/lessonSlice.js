import { createSlice } from "@reduxjs/toolkit";

const lessonSlice = createSlice({
  name: "lessons",
  initialState: [],
  reducers: {
    setLessons(_, { payload }) {
      return payload;
    },
  },
});

const { actions, reducer } = lessonSlice;
export const { setLessons } = actions;
export default reducer;
