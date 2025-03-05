import { useAppSelector } from "@/hooks/useAppStore";
import { selectThemeMode } from "@/store/slices/appSlice";
import { themeColors } from "@/theme/colors";
import { ThemeMode } from "@/types/theme";

export const getThemeColors = (themeMode: ThemeMode) => {
  return themeColors[themeMode];
};

export const useThemeColors = () => {
  const themeMode = useAppSelector(selectThemeMode);
  return getThemeColors(themeMode);
};
