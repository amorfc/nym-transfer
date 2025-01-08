// src/slices/nymApiSlice.ts
import NymClientManager from "@/service/nym/NymClientManager";
import { UploadMixnetRequest } from "@/service/request/UploadMixnetRequest";
import { selectUserId } from "@/store/slice/appSlice";
import {
  selectNymClientState,
  setIsConnected,
  setSelfAddress,
} from "@/store/slice/nymClientSlice";
import { RootState } from "@/store/store";
import { notifyWarning } from "@/utils/GlobalNotification";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const nymApi = createApi({
  reducerPath: "nymApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    keepAliveNymClient: builder.mutation<void, void>({
      async queryFn(_, { dispatch }) {
        try {
          const nymClientManager = NymClientManager.getInstance();
          await nymClientManager.init({
            onConnected: () => dispatch(setIsConnected(true)),
            onSelfAddress: (address) => dispatch(setSelfAddress(address)),
            onDisconnected: () => {
              dispatch(setIsConnected(false));
              // If disconnected, try to reconnect after 10 seconds
              setTimeout(() => {
                nymApi.endpoints.keepAliveNymClient.initiate(undefined, {
                  track: false,
                  fixedCacheKey: "keepAlive",
                });
              }, 10000);
            },
          });
          return { data: undefined };
        } catch (error) {
          console.error("Connection failed:", error);
          // If connection fails, try again after 10 seconds
          setTimeout(() => {
            nymApi.endpoints.keepAliveNymClient.initiate(undefined, {
              track: false,
              fixedCacheKey: "keepAlive",
            });
          }, 10000);
          return { error };
        }
      },
    }),
    stopClient: builder.mutation<void, void>({
      async queryFn() {
        try {
          await NymClientManager.getInstance().stop();
          notifyWarning("Nym client stopped/disconnected");
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
    }),
    uploadFile: builder.mutation<
      void,
      { payload: { title: string; content: Uint8Array } }
    >({
      async queryFn({ payload }, { getState }) {
        try {
          const { recipientAddress, selfAddress } = selectNymClientState(
            getState() as RootState
          );
          const userId = selectUserId(getState() as RootState);

          if (!recipientAddress || !selfAddress) {
            throw new Error("Recipient or self address is not set");
          }

          if (!userId) {
            throw new Error("User ID is not set");
          }

          const requestPayload = {
            userId,
            title: payload.title,
            content: Array.from(payload.content),
          };

          const request = new UploadMixnetRequest(
            recipientAddress,
            selfAddress,
            requestPayload
          );

          const response = await NymClientManager.getInstance().sendMessage(
            request
          );

          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const {
  useKeepAliveNymClientMutation,
  useStopClientMutation,
  useUploadFileMutation,
} = nymApi;
