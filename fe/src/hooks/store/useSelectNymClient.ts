import { useAppSelector } from "@/hooks/useAppStore";
import { selectNymClientState } from "@/store/slice/nymClientSlice";

export const useSelectNymClient = () =>
  useAppSelector((state) => selectNymClientState(state));
