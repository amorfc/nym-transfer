import { useAppSelector } from "@/hooks/useAppStore.ts";
import { selectThemeMode } from "@/store/slice/appSlice.ts";
import { themeColors } from "@/theme/colors.ts";

export const useThemeColors = () => {
  const themeMode = useAppSelector(selectThemeMode);
  return themeColors[themeMode];
};
