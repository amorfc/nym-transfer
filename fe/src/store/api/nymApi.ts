// src/slices/nymApiSlice.ts
import NymClientManager, {
  NymClientEventHandlers,
} from "@/service/nym/NymClientManager";
import { UploadMixnetRequest } from "@/service/request/UploadMixnetRequest";
import { selectUserId } from "@/store/slice/appSlice";
import { selectNymClientState } from "@/store/slice/nymClientSlice";
import { RootState } from "@/store/store";
import { notifySuccess, notifyWarning } from "@/utils/GlobalNotification";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const nymApi = createApi({
  reducerPath: "nymApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    initClient: builder.mutation<
      void,
      { eventHandlers?: NymClientEventHandlers }
    >({
      async queryFn({ eventHandlers }) {
        try {
          const nymClientManager = NymClientManager.getInstance();
          await nymClientManager.init(eventHandlers);
          notifySuccess("Nym client connected");
          return { data: undefined };
        } catch (error) {
          console.log({ error });

          return { error };
        }
      },
    }),
    stopClient: builder.mutation<void, void>({
      async queryFn() {
        try {
          const nymClientManager = NymClientManager.getInstance();
          await nymClientManager.stop();
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
          const { recipientAddress } = selectNymClientState(
            getState() as RootState
          );
          const userId = selectUserId(getState() as RootState);

          if (!recipientAddress) {
            throw new Error("Recipient address is not set");
          }

          if (!userId) {
            throw new Error("User ID is not set");
          }

          const request = new UploadMixnetRequest(recipientAddress, {
            userId,
            title: payload.title,
            content: Array.from(payload.content),
          });

          const nymClientManager = NymClientManager.getInstance();
          const response = await nymClientManager.sendMessage(
            recipientAddress,
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
  useInitClientMutation,
  useStopClientMutation,
  useUploadFileMutation,
} = nymApi;
