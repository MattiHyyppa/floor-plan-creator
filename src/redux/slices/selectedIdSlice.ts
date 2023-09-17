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
      state.value = (!shape) ? null : shape.id;
    },
  }
});

export const { setSelectedId, setSelectedShape } = selectedIdSlice.actions;

export default selectedIdSlice.reducer;
