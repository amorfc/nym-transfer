import { useEffect, useCallback, useRef } from "react";
import { useKeepAliveNymClientMutation } from "@/store/api/nymApi";
import { useAppDispatch } from "@/hooks/useAppStore";
import { setIsConnected, setIsConnecting } from "@/store/slice/nymClientSlice";
import { useSelectNymClient } from "../store/useSelectNymClient";

export const useNymConnection = () => {
  const dispatch = useAppDispatch();
  const retryCount = useRef(0);
  const retryTimeout = useRef<NodeJS.Timeout>(undefined);
  const [keepAliveNymClient] = useKeepAliveNymClientMutation();
  const { isConnected } = useSelectNymClient();

  const MAX_RETRIES = 5;
  const RETRY_DELAY = 2000;
  const MAX_RETRY_DELAY = 30000;

  const connect = useCallback(async () => {
    try {
      dispatch(setIsConnecting(true));
      await keepAliveNymClient().unwrap();
      retryCount.current = 0; // Reset retry count on success
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? error.message
          : "Unknown error";
      console.error("Connection failed:", errorMessage);
      dispatch(setIsConnected(false));
      dispatch(setIsConnecting(false));

      if (retryCount.current < MAX_RETRIES) {
        const delay = Math.min(
          RETRY_DELAY * Math.pow(2, retryCount.current),
          MAX_RETRY_DELAY
        );
        console.debug(
          `Retrying connection in ${delay}ms (attempt ${
            retryCount.current + 1
          })`
        );

        retryTimeout.current = setTimeout(() => {
          retryCount.current++;
          connect();
        }, delay);
      }
    } finally {
      dispatch(setIsConnecting(false));
    }
  }, [dispatch, keepAliveNymClient]);

  // Initial connection and reconnection logic
  useEffect(() => {
    connect();

    // Periodic health check
    const healthCheck = setInterval(() => {
      if (!isConnected) {
        console.debug("Connection check failed, attempting reconnect...");
        connect();
      }
    }, 30000);

    return () => {
      clearInterval(healthCheck);
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
      }
    };
  }, [connect, isConnected]);

  return { connect };
};
