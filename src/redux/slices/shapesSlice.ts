import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { CustomShapeConfig } from '../../types';

const initialState: CustomShapeConfig[] = [];

export const shapesSlice = createSlice({
  name: 'shapes',
  initialState,
  reducers: {
    setAllShapes: (_state, action: PayloadAction<CustomShapeConfig[]>) => {
      return action.payload;
    },
    updateShape: (state, action: PayloadAction<{ id: string, newAttrs: Partial<CustomShapeConfig> }>) => {
      const index = state.findIndex((shape) => shape.id === action.payload.id);
      if (index !== -1) {
        const currentShape = state[index];
        const newShape = {
          ...currentShape,
          ...action.payload.newAttrs,
        };
        state[index] = newShape;
      }
    },
  }
});

export const { setAllShapes, updateShape } = shapesSlice.actions;

export default shapesSlice.reducer;
