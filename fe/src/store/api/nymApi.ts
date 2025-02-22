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
import { FileInfoResponseData } from "@/service/response/FileInfoMixnetResponse";
import {
  FileInfoPayload,
  FileInfoMixnetRequest,
} from "@/service/request/FileInfoMixnetRequest";

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

          console.log("sending payload", { payload });
          const requestPayload = {
            userId,
            title: payload.title,
            message: payload.message,
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
    getFileInfo: builder.query<
      FileInfoResponseData,
      { payload: Omit<FileInfoPayload, "userId"> }
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

          const request = new FileInfoMixnetRequest(
            recipientAddress,
            selfAddress,
            requestPayload
          );

          const response =
            await NymClientManager.getInstance().sendFileInfoRequest(request);
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
  useGetFileInfoQuery,
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

// const a = [
//   86, 22, -114, -2, 97, 107, 83, 42, -100, -111, -106, -123, 112, -75, 71, -80,
//   -96, 9, -35, 18, -42, -117, -11, 68, -75, -96, 76, -109, 76, 75, 57, -127,
//   -65, -79, 48, 108, -29, -86, -80, 89, -11, 30, -109, 127, -120, 4, 60, 102,
//   58, -67, 65, -28, 100, 70, -70, -98, -116, 122, -34, -70, -85, -120, -60, 108,
//   95, -63, 14, 76, 16, -94, -112, 83, -53, -126, 95, 119, -102, -118, 93, 85,
//   106, -5, 89, -122, -97, -6, 22, -106, -110, -89, -73, 24, -6, -60, 68, 123,
// ];

// console.log(a.map((x) => x.toString()).join(","));
