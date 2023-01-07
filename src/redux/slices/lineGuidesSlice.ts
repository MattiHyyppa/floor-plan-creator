import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type {
  HorizontalLineGuideConfig,
  VerticalLineGuideConfig
} from '../../components/Shapes/LineGuide';

export interface LineGuideState {
  vertical: VerticalLineGuideConfig | null;
  horizontal: HorizontalLineGuideConfig | null;
}

const initialState: LineGuideState = {
  vertical: null,
  horizontal: null,
};

export const lineGuidesSlice = createSlice({
  name: 'lineGuides',
  initialState,
  reducers: {
    setVerticalLineGuide: (state, action: PayloadAction<LineGuideState['vertical']>) => {
      state.vertical = action.payload;
    },
    setHorizontalLineGuide: (state, action: PayloadAction<LineGuideState['horizontal']>) => {
      state.horizontal = action.payload;
    },
  }
});

export const { setVerticalLineGuide, setHorizontalLineGuide } = lineGuidesSlice.actions;

export default lineGuidesSlice.reducer;
