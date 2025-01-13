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
  setIsConnecting,
  setSelfAddress,
} from "@/store/slice/nymClientSlice";
import { RootState } from "@/store/store";
import { notifyWarning } from "@/components/toast/toast";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const nymApi = createApi({
  reducerPath: "nymApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    keepAliveNymClient: builder.mutation<void, void>({
      async queryFn(_, { dispatch }) {
        try {
          const nymClientManager = NymClientManager.getInstance();
          console.debug("Nym Mixnet Connection initializing...");

          await nymClientManager.init({
            onConnected: () => {
              dispatch(setIsConnected(true));
              dispatch(setIsConnecting(false));
            },
            onSelfAddress: (address) => {
              dispatch(setSelfAddress(address));
              dispatch(setIsConnecting(false));
            },
            onDisconnected: () => {
              dispatch(setIsConnected(false));
              dispatch(setIsConnecting(false));
            },
          });
          return { data: undefined };
        } catch (error) {
          dispatch(setIsConnecting(false));
          dispatch(setIsConnected(false));
          // Serialize the error before returning it to Redux
          return {
            error: {
              message: error instanceof Error ? error.message : "Unknown error",
              name: error instanceof Error ? error.name : "Error",
            },
          };
        }
      },
    }),
    stopClient: builder.mutation<void, void>({
      async queryFn() {
        try {
          await NymClientManager.getInstance().stop();
          notifyWarning({ message: "Nym client stopped/disconnected" });
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
          const { recipientAddress, selfAddress, userId } = validateClientState(
            getState as () => RootState
          );

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
          const { recipientAddress, selfAddress, userId } = validateClientState(
            getState as () => RootState
          );

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
