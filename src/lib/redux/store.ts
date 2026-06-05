import { configureStore } from '@reduxjs/toolkit'

export const makeStore = () => {
  const dummyReducer = (state = {}) => state;
  return configureStore({
    reducer: {dummyReducer},
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']