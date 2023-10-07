import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { MenuState } from '../../types';

const initialState: MenuState = {
  activeTab: 0,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
  }
});

export const { setActiveTab } = menuSlice.actions;

export default menuSlice.reducer;
