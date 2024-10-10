import { notification } from "antd";
import { ArgsProps } from "antd/es/notification/interface";

export type AppNotifyParams = Omit<ArgsProps, "message">;

export const notify = (message: string, params: AppNotifyParams) => {
  const { type = "info" } = params;

  notification.open({
    description: message,
    showProgress: true,
    pauseOnHover: true,
    ...params,
    message: type.toUpperCase(),
  });
};

export const notifySuccess = (message: string, params?: AppNotifyParams) =>
  notify(message, {
    ...params,
    type: "success",
  });

export const notifyError = (message: string, params?: AppNotifyParams) =>
  notify(message, {
    ...params,
    type: "error",
  });

export const notifyWarning = (message: string, params?: AppNotifyParams) =>
  notify(message, {
    ...params,
    type: "warning",
  });

export const notifyInfo = (message: string, params?: AppNotifyParams) =>
  notify(message, {
    ...params,
    type: "info",
  });
