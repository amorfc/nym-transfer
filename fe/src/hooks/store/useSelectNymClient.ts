import { useAppSelector } from "@/hooks/useAppStore";
import { selectNymClientState } from "@/store/slices/nymClientSlice";

export const useSelectNymClient = () =>
  useAppSelector((state) => selectNymClientState(state));
