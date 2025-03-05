import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { ThemeMode } from "@/types/theme";
import uuid4 from "uuid4";
import { storage } from "@/utils/storage";

interface AppState {
  userId: string | null;
  themeMode: ThemeMode;
  maxFileCount: number;
  multipleFiles: boolean;
}

// Get existing userId or generate new one
const getInitialUserId = (): string => {
  const storedUserId = storage.getUserId();
  if (storedUserId) {
    return storedUserId;
  }
  const newUserId = uuid4();
  storage.setUserId(newUserId);
  return newUserId;
};

const initialState: AppState = {
  userId: getInitialUserId(),
  themeMode: ThemeMode.DARK,
  maxFileCount: 3,
  multipleFiles: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      storage.setUserId(action.payload);
      state.userId = action.payload;
    },
    removeUserId: (state) => {
      state.userId = null;
      storage.removeUserId();
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
