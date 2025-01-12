import { ThemeColors } from "@/theme/colors";
import { ToastOptions } from "react-toastify";

export const getToastConfig = (colors: ThemeColors): ToastOptions => ({
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  style: {
    background: colors.bgOverlay,
    border: `1px solid ${colors.borderPrimary}`,
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    backdropFilter: "blur(10px)",
    color: colors.textPrimary,
    fontSize: "14px",
    fontWeight: 500,
  },
});
