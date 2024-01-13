import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import type { CustomShapeConfig, CanvasState, CanvasUpdate } from '../../types';
import type { RectangleHouseConfig } from '../../components/Shapes/RectangleHouse';
import type { LShapedHouseConfig } from '../../components/Shapes/LShapedHouse';
import type { WallConfig } from '../../components/Shapes/Wall';
import type { DoorConfig } from '../../components/Shapes/Door';
import type { WindowConfig } from '../../components/Shapes/Window';
import { assertNever, cmToPixels } from '../../utils';

// How many canvas update operations can be stored before new entries start replacing the
// oldest entries
const HISTORY_MAX_LENGTH = 100;

/**
 * A helper function for adding a new entry to the canvas history.
 */
const addToHistory = (state: CanvasState, canvasUpdate: CanvasUpdate) => {
  // This function is called when a shape has been updated/added/deleted on/to/from the canvas.
  // A new entry should be added to the history. However, it is possible that 'undo' operation has
  // been used previously. Therefore, let's disable the 'redo' operation by discarding any previous
  // updates stored at indices greater than `state.previousUpdatesIndex`.
  state.previousUpdates = state.previousUpdates.slice(0, state.previousUpdatesIndex + 1);

  const isHistoryFull = state.previousUpdates.length >= HISTORY_MAX_LENGTH;
  if (isHistoryFull) {
    // Remove the oldest entry.
    state.previousUpdates = state.previousUpdates.slice(1, state.previousUpdates.length);
    state.previousUpdatesIndex--;
  }

  state.previousUpdates.push(canvasUpdate);
  state.previousUpdatesIndex++;
};

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
      addToHistory(state, {
        operation: 'add',
        current: house,
        index: state.shapes.length - 1,
      });
    },

    addLShapedHouse: (state) => {
      const house: LShapedHouseConfig = {
        id: uuidv4(),
        x: 100,
        y: 100,
        rotation: 0,
        exteriorWidth: cmToPixels(1400),
        exteriorHeight: cmToPixels(1000),
        wallThickness: cmToPixels(30),
        draggable: true,
        firstWingWidth: cmToPixels(500),
        secondWingWidth: cmToPixels(500),
      };

      state.shapes.push(house);
      addToHistory(state, {
        operation: 'add',
        current: house,
        index: state.shapes.length - 1,
      });
    },

    addExteriorDoor: (state) => {
      const door: DoorConfig = {
        id: uuidv4(),
        x: 75,
        y: 75,
        rotation: 0,
        doorWidth: cmToPixels(80),
        kind: 'exterior',
        openingDirection: 'right',
        wallThickness: cmToPixels(30),
        draggable: true,
      };

      state.shapes.push(door);
      addToHistory(state, {
        operation: 'add',
        current: door,
        index: state.shapes.length - 1,
      });
    },

    addInteriorDoor: (state) => {
      const door: DoorConfig = {
        id: uuidv4(),
        x: 75,
        y: 75,
        rotation: 0,
        doorWidth: cmToPixels(80),
        kind: 'interior',
        openingDirection: 'right',
        wallThickness: cmToPixels(12),
        draggable: true,
      };

      state.shapes.push(door);
      addToHistory(state, {
        operation: 'add',
        current: door,
        index: state.shapes.length - 1,
      });
    },

    addWall: (state) => {
      const wall: WallConfig = {
        id: uuidv4(),
        x: 75,
        y: 75,
        rotation: 0,
        width: cmToPixels(300),
        wallThickness: cmToPixels(12),
        draggable: true,
      };

      state.shapes.push(wall);
      addToHistory(state, {
        operation: 'add',
        current: wall,
        index: state.shapes.length - 1,
      });
    },

    addWindow: (state) => {
      const w: WindowConfig = {
        id: uuidv4(),
        x: 75,
        y: 75,
        rotation: 0,
        windowWidth: cmToPixels(200),
        wallThickness: cmToPixels(30),
        draggable: true,
      };

      state.shapes.push(w);
      addToHistory(state, {
        operation: 'add',
        current: w,
        index: state.shapes.length - 1,
      });
    },

    deleteShape: (state, action: PayloadAction<{ id: string }>) => {
      const indexToDelete = state.shapes.findIndex(shape => shape.id === action.payload.id);

      if (indexToDelete === -1) {
        return;
      }

      const shapeToDelete = state.shapes[indexToDelete];
      state.shapes.splice(indexToDelete, 1);

      addToHistory(state, {
        operation: 'delete',
        previous: shapeToDelete,
        index: indexToDelete,
      });
    },

    updateShape: (state, action: PayloadAction<{ id: string, newAttrs: Partial<CustomShapeConfig> }>) => {
      const index = state.shapes.findIndex((shape) => shape.id === action.payload.id);
      if (index === -1) {
        return;
      }
      const shapeBeforeUpdate = state.shapes[index];
      const newShape = {
        ...shapeBeforeUpdate,
        ...action.payload.newAttrs,
      };
      state.shapes[index] = newShape;

      addToHistory(state, {
        operation: 'update',
        previous: shapeBeforeUpdate,
        current: newShape,
        index,
      });
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
  deleteShape,
  addRectangleHouse,
  addLShapedHouse,
  addInteriorDoor,
  addExteriorDoor,
  addWall,
  addWindow,
} = canvasSlice.actions;

export default canvasSlice.reducer;
