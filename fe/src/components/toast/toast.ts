import { toast, ToastOptions } from "react-toastify";
import { getThemeColors } from "@/hooks/useThemeColors";
import { getToastConfig } from "@/components/toast/toastConfig";
import { store } from "@/store/store";

type NotifyType = "success" | "error" | "info" | "warning";

interface NotifyParams extends Partial<ToastOptions> {
  message: string;
}

const getToastMethod = (type: NotifyType) => {
  switch (type) {
    case "success":
      return toast.success;
    case "error":
      return toast.error;
    case "warning":
      return toast.warning;
    default:
      return toast.info;
  }
};

const notify = (type: NotifyType, { message, ...options }: NotifyParams) => {
  const colors = getThemeColors(store?.getState()?.app?.themeMode);
  const defaultConfig = getToastConfig(colors);

  const toastMethod = getToastMethod(type);
  toastMethod(message, {
    ...defaultConfig,
    ...options,
    // progressStyle: {
    //   background:
    //     type === "success"
    //       ? colors.success
    //       : type === "error"
    //       ? colors.error
    //       : type === "warning"
    //       ? colors.warning
    //       : colors.primary,
    // },
  });
};

export const notifySuccess = (params: NotifyParams) =>
  notify("success", params);
export const notifyError = (params: NotifyParams) => notify("error", params);
export const notifyWarning = (params: NotifyParams) =>
  notify("warning", params);
export const notifyInfo = (params: NotifyParams) => notify("info", params);
