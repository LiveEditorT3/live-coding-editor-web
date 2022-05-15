import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.state";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
