import { useAppSelector } from "@/hooks/useAppStore.ts";
import { selectThemeMode } from "@/store/slice/appSlice.ts";
import { themeColors } from "@/theme/colors.ts";
import { ThemeMode } from "@/types/theme";

export const getThemeColors = (themeMode: ThemeMode) => {
  return themeColors[themeMode];
};

export const useThemeColors = () => {
  const themeMode = useAppSelector(selectThemeMode);
  return getThemeColors(themeMode);
};
