import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store.ts";
import { ThemeMode } from "@/types/theme.ts";

interface AppState {
  themeMode: ThemeMode;
}

const initialState: AppState = {
  themeMode: ThemeMode.DARK,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.themeMode =
        state.themeMode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK;
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
  },
});

export const { toggleTheme, setThemeMode } = appSlice.actions;
export const selectThemeMode = (state: RootState) => state.app.themeMode;
export default appSlice.reducer;
