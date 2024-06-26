import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import type { CustomShapeConfig, CanvasState, CanvasUpdate } from '../../types';
import type {
  RectangleHouseConfig,
  LShapedHouseConfig,
  WallConfig,
  DoorConfig,
  WindowConfig,
  BoxConfig,
  ElectricApplianceConfig,
  TextConfig,
  SinkConfig,
  StoveConfig,
  ToiletConfig,
  TapeMeasureConfig,
} from '../../types';
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

      /* Reset the history of previous updates. This is necessary because the history is being updated by keeping
      track of the changes made to one object at a time. For now, the history cannot process changes that update
      multiple shape objects at a time. */
      state.previousUpdates = initialState.previousUpdates;
      state.previousUpdatesIndex =initialState.previousUpdatesIndex;
    },

    addRectangleHouse: (state) => {
      const house: RectangleHouseConfig = {
        id: uuidv4(),
        shapeName: 'rectangleHouse',
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
        shapeName: 'lShapedHouse',
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
        shapeName: 'door',
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
        shapeName: 'door',
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
        shapeName: 'wall',
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
        shapeName: 'window',
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

    addBox: (state) => {
      const box: BoxConfig = {
        id: uuidv4(),
        shapeName: 'box',
        x: 75,
        y: 75,
        rotation: 0,
        width: cmToPixels(100),
        depth: cmToPixels(60),
        draggable: true,
      };

      state.shapes.push(box);
      addToHistory(state, {
        operation: 'add',
        current: box,
        index: state.shapes.length - 1,
      });
    },

    addElectricAppliance: (state) => {
      const shape: ElectricApplianceConfig = {
        id: uuidv4(),
        shapeName: 'electricAppliance',
        x: 75,
        y: 75,
        rotation: 0,
        width: cmToPixels(60),
        depth: cmToPixels(60),
        draggable: true,
      };

      state.shapes.push(shape);
      addToHistory(state, {
        operation: 'add',
        current: shape,
        index: state.shapes.length - 1,
      });
    },

    addText: (state) => {
      const shape: TextConfig = {
        id: uuidv4(),
        shapeName: 'text',
        x: 75,
        y: 75,
        rotation: 0,
        draggable: true,
        fontSize: 14,
        text: 'text',
      };

      state.shapes.push(shape);
      addToHistory(state, {
        operation: 'add',
        current: shape,
        index: state.shapes.length - 1,
      });
    },

    addSink: (state) => {
      const shape: SinkConfig = {
        id: uuidv4(),
        shapeName: 'sink',
        x: 75,
        y: 75,
        width: cmToPixels(50),
        depth: cmToPixels(50),
        rotation: 0,
        draggable: true,
      };

      state.shapes.push(shape);
      addToHistory(state, {
        operation: 'add',
        current: shape,
        index: state.shapes.length - 1,
      });
    },

    addStove: (state) => {
      const shape: StoveConfig = {
        id: uuidv4(),
        shapeName: 'stove',
        x: 75,
        y: 75,
        width: cmToPixels(60),
        depth: cmToPixels(60),
        rotation: 0,
        draggable: true,
      };

      state.shapes.push(shape);
      addToHistory(state, {
        operation: 'add',
        current: shape,
        index: state.shapes.length - 1,
      });
    },

    addToilet: (state) => {
      const shape: ToiletConfig = {
        id: uuidv4(),
        shapeName: 'toilet',
        x: 75,
        y: 75,
        width: cmToPixels(36),
        depth: cmToPixels(65),
        rotation: 0,
        draggable: true,
      };

      state.shapes.push(shape);
      addToHistory(state, {
        operation: 'add',
        current: shape,
        index: state.shapes.length - 1,
      });
    },

    addTapeMeasure: (state) => {
      const shape: TapeMeasureConfig = {
        id: uuidv4(),
        shapeName: 'tapeMeasure',
        x: 75,
        y: 75,
        width: cmToPixels(500),
        rotation: 0,
        draggable: true,
      };

      state.shapes.push(shape);
      addToHistory(state, {
        operation: 'add',
        current: shape,
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

    updateShape: (state, action: PayloadAction<{ id: string, newAttrs: Partial<Omit<CustomShapeConfig, 'shapeName'>> }>) => {
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
  addBox,
  addElectricAppliance,
  addText,
  addSink,
  addStove,
  addToilet,
  addTapeMeasure,
} = canvasSlice.actions;

export default canvasSlice.reducer;
