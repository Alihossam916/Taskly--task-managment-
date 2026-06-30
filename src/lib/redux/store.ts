import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./feature/sidebarSlice";
import taskModalReducer from "./feature/taskModalSlice";
import membersModalReducer from "./feature/membersModalSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      sidebar: sidebarReducer,
      taskModal: taskModalReducer,
      membersModal: membersModalReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
