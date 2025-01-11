import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store.ts";
import { ThemeMode } from "@/types/theme.ts";

interface AppState {
  userId: string | null;
  themeMode: ThemeMode;
  maxFileCount: number;
  multipleFiles: boolean;
}

const initialState: AppState = {
  userId: null,
  themeMode: ThemeMode.DARK,
  maxFileCount: 3,
  multipleFiles: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    removeUserId: (state) => {
      state.userId = null;
    },
    toggleTheme: (state) => {
      state.themeMode =
        state.themeMode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK;
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
  },
});

export const { toggleTheme, setThemeMode, setUserId, removeUserId } =
  appSlice.actions;
export const selectThemeMode = (state: RootState) => state.app.themeMode;
export const selectUserId = (state: RootState) => state.app.userId;
export const selectMaxFileCount = (state: RootState) => state.app.maxFileCount;
export const selectMultipleFiles = (state: RootState) =>
  state.app.multipleFiles;

export default appSlice.reducer;
