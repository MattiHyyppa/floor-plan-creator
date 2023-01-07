import { configureStore } from '@reduxjs/toolkit';

import lineGuidesReducer from './slices/lineGuidesSlice';
import selectedIdReducer from './slices/selectedIdSlice';

export const store = configureStore({
  reducer: {
    lineGuides: lineGuidesReducer,
    selectedId: selectedIdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
