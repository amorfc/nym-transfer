import { useAppSelector } from "@/hooks/useAppStore";

export const useSelectNymClient = () =>
  useAppSelector((state) => state.nymClient);
