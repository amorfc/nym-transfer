// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { nymApi } from "@/store/api/nymApi";
import nymClientReducer from "@/store/slice/nymClientSlice";
import appReducer from "@/store/slice/appSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    [nymApi.reducerPath]: nymApi.reducer,
    nymClient: nymClientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(nymApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
