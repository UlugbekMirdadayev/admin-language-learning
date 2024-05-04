import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "user",
  initialState: JSON.parse(localStorage.getItem("user-admin-language-learning")) || {},
  reducers: {
    setUser(_, { payload }) {
      localStorage.setItem("user-admin-language-learning", JSON.stringify(payload));
      return payload;
    },
  },
});

const { actions, reducer } = postsSlice;
export const { setUser } = actions;
export default reducer;
