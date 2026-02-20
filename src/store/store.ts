import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "features/auth/redux";
import { modalSlice } from "./utility/modalSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    modals: modalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
