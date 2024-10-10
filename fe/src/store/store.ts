// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { nymApi } from "@/store/api/nymApi.ts";
import nymClientReducer from "@/store/slice/nymClientSlice";

export const store = configureStore({
  reducer: {
    [nymApi.reducerPath]: nymApi.reducer,
    nymClient: nymClientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(nymApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
