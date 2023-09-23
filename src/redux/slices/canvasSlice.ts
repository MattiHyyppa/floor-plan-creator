import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { CustomShapeConfig } from '../../types';

export interface CanvasState {
  shapes: CustomShapeConfig[];
}

const initialState: CanvasState = {
  shapes: [],
};

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setAllShapes: (state, action: PayloadAction<CustomShapeConfig[]>) => {
      state.shapes = action.payload;
    },
    updateShape: (state, action: PayloadAction<{ id: string, newAttrs: Partial<CustomShapeConfig> }>) => {
      const index = state.shapes.findIndex((shape) => shape.id === action.payload.id);
      if (index !== -1) {
        const currentShape = state.shapes[index];
        const newShape = {
          ...currentShape,
          ...action.payload.newAttrs,
        };
        state.shapes[index] = newShape;
      }
    },
  }
});

export const { setAllShapes, updateShape } = canvasSlice.actions;

export default canvasSlice.reducer;
