// src/slices/nymClientSlice.ts
import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NymClientState {
  isConnected: boolean;
  isConnecting: boolean;
  selfAddress: string | null;
  receivedMessage: string | null;
  recipientAddress: string | null; // Add recipientAddress field
}

const initialState: NymClientState = {
  isConnected: false,
  isConnecting: false,
  selfAddress: null,
  receivedMessage: null,
  recipientAddress: null,
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
    setSelfAddress(state, action: PayloadAction<string | null>) {
      state.selfAddress = action.payload;
    },
    setReceivedMessage(state, action: PayloadAction<string | null>) {
      state.receivedMessage = action.payload;
    },
    setRecipientAddress(state, action: PayloadAction<string | null>) {
      // Add setRecipientAddress reducer
      state.recipientAddress = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

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
