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
    updateShape: (state, action: PayloadAction<{ id: string, newAttrs: CustomShapeConfig }>) => {
      const index = state.findIndex((shape) => shape.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload.newAttrs;
      }
    },
  }
});

export const { setAllShapes, updateShape } = shapesSlice.actions;

export default shapesSlice.reducer;
