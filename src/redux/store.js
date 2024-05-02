import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice";
import users from "./reportSlice";
import loader from "./loaderSlice";
import lessons from "./lessonSlice";

const store = configureStore({
  reducer: {
    user,
    users,
    loader,
    lessons,
  },
});

export default store;
