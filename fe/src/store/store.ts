// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { nymApi } from "@/store/api/nymApi";
import nymClientReducer from "@/store/slices/nymClientSlice";
import appReducer from "@/store/slices/appSlice";
import benchmarkReducer from "@/store/slices/benchmarkSlice";
import { Env } from "@/env";
export const store = configureStore({
  reducer: {
    app: appReducer,
    nymClient: nymClientReducer,
    [nymApi.reducerPath]: nymApi.reducer,
    ...(Env.IS_DEV ? { benchmark: benchmarkReducer } : {}),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(nymApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
