import { configureStore } from '@reduxjs/toolkit';

import lineGuidesReducer from './slices/lineGuidesSlice';

export const store = configureStore({
  reducer: {
    lineGuides: lineGuidesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
