import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { CustomShapeConfig } from '../../types';

export interface SelectedIdState {
  value: string | null;
}

const initialState: SelectedIdState = {
  value: null,
};

export const selectedIdSlice = createSlice({
  name: 'selectedId',
  initialState,
  reducers: {
    setSelectedId: (state, action: PayloadAction<string | null>) => {
      state.value = action.payload;
    },
    setSelectedShape: (state, action: PayloadAction<CustomShapeConfig | null>) => {
      const shape = action.payload;

      // A function for setting the `state.value` to null if it is not already
      const setToNull = () => {
        if (state.value) {
          state.value = null;
        }
      };

      if (!shape) {
        setToNull();
        return;
      }

      // If the shape is not draggable, prevent it to become selected (meaning that its size
      // and rotation couldn't be transformed either)
      if (!shape.draggable) {
        setToNull();
        return;
      }

      state.value = shape.id;
    },
  }
});

export const { setSelectedId, setSelectedShape } = selectedIdSlice.actions;

export default selectedIdSlice.reducer;
