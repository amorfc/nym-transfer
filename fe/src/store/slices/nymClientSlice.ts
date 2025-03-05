// src/slices/nymClientSlice.ts
import { Env } from "@/env";
import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NymClientState {
  isConnected: boolean;
  isConnecting: boolean;
  selfAddress: number[] | null;
  receivedMessage: string | null;
  recipientAddress: number[] | null;
}

const initialState: NymClientState = {
  isConnected: false,
  isConnecting: false,
  selfAddress: null,
  receivedMessage: null,
  recipientAddress: Env.NYM_BACKEND_CLIENT_ADDRESS_BYTES,
};

const nymClientSlice = createSlice({
  name: "nymClient",
  initialState,
  reducers: {
    setIsConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
      state.isConnecting = false;
    },
    setIsConnecting(state, action: PayloadAction<boolean>) {
      state.isConnecting = action.payload;
    },
    setSelfAddress(state, action: PayloadAction<number[] | null>) {
      state.selfAddress = action.payload;
    },
    setReceivedMessage(state, action: PayloadAction<string | null>) {
      state.receivedMessage = action.payload;
    },
    setRecipientAddress(state, action: PayloadAction<string>) {
      // Add setRecipientAddress reducer

      state.recipientAddress = parseNumberArray(action.payload);
    },
    resetState() {
      return initialState;
    },
  },
});

//temporary function to parse number array from string
function parseNumberArray(str: string): number[] {
  return str
    .replace(/[[\]\s]/g, "") // Remove brackets and whitespace
    .split(",")
    .filter(Boolean) // Remove empty strings
    .map(Number); // Convert to numbers
}

export const {
  setIsConnected,
  setIsConnecting,
  setSelfAddress,
  setReceivedMessage,
  setRecipientAddress,
  resetState,
} = nymClientSlice.actions;

export const selectNymClientState = (state: RootState) => state.nymClient;

export default nymClientSlice.reducer;
