import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.state";
import themeReducer from "./theme.state"

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer
  },
});
