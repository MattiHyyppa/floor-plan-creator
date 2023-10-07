import { configureStore } from '@reduxjs/toolkit';

import lineGuidesReducer from './slices/lineGuidesSlice';
import selectedIdReducer from './slices/selectedIdSlice';
import canvasReducer from './slices/canvasSlice';
import menuReducer from './slices/menuSlice';

export const store = configureStore({
  reducer: {
    lineGuides: lineGuidesReducer,
    selectedId: selectedIdReducer,
    canvas: canvasReducer,
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
