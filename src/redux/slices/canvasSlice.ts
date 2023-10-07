import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import type { CustomShapeConfig, CanvasState } from '../../types';
import type { RectangleHouseConfig } from '../../components/Shapes/RectangleHouse';
import type { LShapedHouseConfig } from '../../components/Shapes/LShapedHouse';
import type { WallConfig } from '../../components/Shapes/Wall';
import type { DoorConfig } from '../../components/Shapes/Door';
import type { WindowConfig } from '../../components/Shapes/Window';
import { assertNever, cmToPixels } from '../../utils';

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

    addRectangleHouse: (state) => {
      const house: RectangleHouseConfig = {
        id: uuidv4(),
        x: 100,
        y: 100,
        rotation: 0,
        exteriorWidth: cmToPixels(1200),
        exteriorHeight: cmToPixels(1000),
        wallThickness: cmToPixels(30),
        draggable: true,
      };

      state.shapes.push(house);
      state.previousUpdates = state.previousUpdates.slice(0, state.previousUpdatesIndex + 1);

      if (state.previousUpdates.length >= HISTORY_MAX_LENGTH) {
        state.previousUpdates = state.previousUpdates.slice(1, state.previousUpdates.length);
        state.previousUpdatesIndex--;
      }

      state.previousUpdates.push({
        operation: 'add',
        current: house,
        index: state.shapes.length - 1,
      });
      state.previousUpdatesIndex++;
    },

    deleteRectangleHouse: (state, action: PayloadAction<{ id: string }>) => {
      const indexToDelete = state.shapes.findIndex(shape => shape.id === action.payload.id);

      if (indexToDelete === -1) {
        return;
      }

      const houseToDelete = state.shapes[indexToDelete];
      state.shapes.splice(indexToDelete, 1);

      state.previousUpdates = state.previousUpdates.slice(0, state.previousUpdatesIndex + 1);

      if (state.previousUpdates.length >= HISTORY_MAX_LENGTH) {
        state.previousUpdates = state.previousUpdates.slice(1, state.previousUpdates.length);
        state.previousUpdatesIndex--;
      }

      state.previousUpdates.push({
        operation: 'delete',
        previous: houseToDelete,
        index: indexToDelete,
      });
      state.previousUpdatesIndex++;
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

      // A shape was updated but it is possible that 'undo' operation has been used previously.
      // Let's disable the 'redo' operation by discarding previous updates stored at indices greater than
      // `state.previousUpdatesIndex`.
      state.previousUpdates = state.previousUpdates.slice(0, state.previousUpdatesIndex + 1);

      // If the history is already full, remove the first entry.
      if (state.previousUpdates.length >= HISTORY_MAX_LENGTH) {
        state.previousUpdates = state.previousUpdates.slice(1, state.previousUpdates.length);
        state.previousUpdatesIndex--;
      }

      // And now add the new update to the state
      state.previousUpdates.push({
        operation: 'update',
        previous: currentShape,
        current: newShape,
        index,
      });
      state.previousUpdatesIndex++;
    },

    undoShapeOperation: (state) => {
      if (state.previousUpdatesIndex < 0) {
        // Cannot go back in the history anymore
        return;
      }
      const canvasUpdate = state.previousUpdates[state.previousUpdatesIndex];

      if (canvasUpdate.operation === 'update') {
        state.shapes[canvasUpdate.index] = canvasUpdate.previous;
        state.previousUpdatesIndex--;
        return;
      }

      else if (canvasUpdate.operation === 'add') {
        const indexToRemove = canvasUpdate.index;
        state.shapes = state.shapes.filter((_shape, idx) => idx !== indexToRemove);
        state.previousUpdatesIndex--;
        return;
      }

      else if (canvasUpdate.operation === 'delete') {
        const shapeToAdd = canvasUpdate.previous;
        state.shapes.splice(canvasUpdate.index, 0, shapeToAdd);
        state.previousUpdatesIndex--;
        return;
      }

      else {
        assertNever(canvasUpdate);
      }
    },

    redoShapeOperation: (state) => {
      if (state.previousUpdatesIndex >= state.previousUpdates.length - 1) {
        // Cannot go forward in the history anymore
        return;
      }

      state.previousUpdatesIndex++;
      const canvasUpdate = state.previousUpdates[state.previousUpdatesIndex];

      if (canvasUpdate.operation === 'update') {
        state.shapes[canvasUpdate.index] = canvasUpdate.current;
        return;
      }

      else if (canvasUpdate.operation === 'add') {
        const shapeToAdd = canvasUpdate.current;
        state.shapes.splice(canvasUpdate.index, 0, shapeToAdd);
        return;
      }

      else if (canvasUpdate.operation === 'delete') {
        const indexToRemove = canvasUpdate.index;
        state.shapes = state.shapes.filter((_shape, idx) => idx !== indexToRemove);
        return;
      }

      else {
        assertNever(canvasUpdate);
      }
    },

  },
});

export const {
  setAllShapes,
  updateShape,
  undoShapeOperation,
  redoShapeOperation,
  addRectangleHouse,
  deleteRectangleHouse,
} = canvasSlice.actions;

export default canvasSlice.reducer;
