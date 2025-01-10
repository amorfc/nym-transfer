import { useSelectNymClient } from "@/hooks/store/useSelectNymClient";

export const useNymClientStatus = () => {
  const { isConnected, isConnecting, selfAddress } = useSelectNymClient();
  const hasSelfAddress = !!selfAddress;

  const isNymClientReady = isConnected && hasSelfAddress && !isConnecting;

  return { isNymClientReady };
};
