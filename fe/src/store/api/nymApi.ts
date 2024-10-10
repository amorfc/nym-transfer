// src/slices/nymApiSlice.ts
import NymClientManager, {
  NymClientEventHandlers,
} from "@/service/nym/NymClientManager";
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
    sendMessage: builder.mutation<
      void,
      { recipient: string; payload: Uint8Array }
    >({
      async queryFn({ recipient, payload }) {
        try {
          const nymClientManager = NymClientManager.getInstance();
          await nymClientManager.sendMessage(recipient, payload);

          return { data: undefined };
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
  useSendMessageMutation,
} = nymApi;
