import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { CustomShapeConfig, CanvasState } from '../../types';

const HISTORY_MAX_LENGTH = 50;

const initialState: CanvasState = {
  shapes: [],
  previousUpdates: [],
  previousUpdatesIndex: -1,
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
      if (index === -1) {
        return;
      }
      const currentShape = state.shapes[index];
      const newShape = {
        ...currentShape,
        ...action.payload.newAttrs,
      };
      state.shapes[index] = newShape;

      let idx = state.previousUpdatesIndex;

      // A shape was updated but it is possible that 'undo' operation has been used previously.
      // Let's disable the 'redo' operation by discarding previous updates stored at indices greater than
      // `state.previousUpdatesIndex`.
      state.previousUpdates = state.previousUpdates.slice(0, idx + 1);

      // If the history is already full, remove the first entry.
      if (state.previousUpdates.length >= HISTORY_MAX_LENGTH) {
        state.previousUpdates = state.previousUpdates.slice(1, state.previousUpdates.length);
        idx--;
      }

      // And now add the new update to the state
      state.previousUpdates.push({
        operation: 'update',
        previous: currentShape,
        new: newShape,
        index,
      });
      state.previousUpdatesIndex = idx + 1;
    },
    undoShapeOperation: (state) => {
      // TODO: ***** Add and remove operations *****
      const idx = state.previousUpdatesIndex;
      if (idx < 0) {
        // Cannot go back in the history anymore
        return;
      }
      const shapeToUpdate = state.previousUpdates[idx];
      state.shapes[shapeToUpdate.index] = shapeToUpdate.previous;
      state.previousUpdatesIndex--;
    },
    redoShapeOperation: (state) => {
      // TODO: ***** Add and remove operations *****
      let idx = state.previousUpdatesIndex;
      if (idx >= state.previousUpdates.length - 1) {
        // Cannot go forward in the history anymore
        return;
      }
      idx++;
      const shapeToUpdate = state.previousUpdates[idx];
      state.shapes[shapeToUpdate.index] = shapeToUpdate.new;
      state.previousUpdatesIndex = idx;
    },
  },
});

export const {
  setAllShapes,
  updateShape,
  undoShapeOperation,
  redoShapeOperation,
} = canvasSlice.actions;

export default canvasSlice.reducer;
