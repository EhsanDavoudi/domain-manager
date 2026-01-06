import { configureStore } from "@reduxjs/toolkit";
import { domainsApi } from "../services/domainsApi";

export const store = configureStore({
  reducer: { [domainsApi.reducerPath]: domainsApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(domainsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
