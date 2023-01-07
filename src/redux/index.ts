import { configureStore } from '@reduxjs/toolkit';

import lineGuidesReducer from './slices/lineGuidesSlice';
import selectedIdReducer from './slices/selectedIdSlice';
import shapesReducer from './slices/shapesSlice';

export const store = configureStore({
  reducer: {
    lineGuides: lineGuidesReducer,
    selectedId: selectedIdReducer,
    shapes: shapesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
