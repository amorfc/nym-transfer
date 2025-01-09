// src/slices/nymApiSlice.ts
import NymClientManager from "@/service/nym/NymClientManager";
import {
  DownloadMixnetRequest,
  DownloadPayload,
} from "@/service/request/DownloadMixnetRequest";
import {
  UploadMixnetRequest,
  UploadPayload,
} from "@/service/request/UploadMixnetRequest";
import { DownloadMixnetResponseData } from "@/service/response/DownloadMixnetResponse";
import { UploadMixnetResponseData } from "@/service/response/UploadMixnetResponse";
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

    downloadFile: builder.mutation<
      DownloadMixnetResponseData,
      { payload: Omit<DownloadPayload, "userId"> }
    >({
      async queryFn({ payload }, { getState }) {
        try {
          const { recipientAddress, selfAddress, userId } =
            validateClientState(getState);

          const requestPayload = {
            userId,
            path: payload.path,
          };

          const request = new DownloadMixnetRequest(
            recipientAddress,
            selfAddress,
            requestPayload
          );

          const response =
            await NymClientManager.getInstance().sendDownloadRequest(request);

          return { data: response.asResponseData() };
        } catch (error) {
          return { error };
        }
      },
    }),
    uploadFile: builder.mutation<
      UploadMixnetResponseData,
      { payload: Omit<UploadPayload, "userId"> }
    >({
      async queryFn({ payload }, { getState }) {
        try {
          const { recipientAddress, selfAddress, userId } =
            validateClientState(getState);

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

          const response =
            await NymClientManager.getInstance().sendUploadRequest(request);

          return { data: response.asResponseData() };
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
  useDownloadFileMutation,
} = nymApi;

function validateClientState(getState: () => RootState) {
  const { recipientAddress, selfAddress } = selectNymClientState(getState());
  const userId = selectUserId(getState());

  if (!recipientAddress || !selfAddress) {
    throw new Error("Recipient or self address is not set");
  }

  if (!userId) {
    throw new Error("User ID is not set");
  }

  return { recipientAddress, selfAddress, userId };
}
