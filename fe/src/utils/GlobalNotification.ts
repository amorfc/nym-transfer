import { notification } from "antd";
import { ArgsProps } from "antd/es/notification/interface";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
  WarningFilled,
} from "@ant-design/icons";
import React from "react";

const baseStyle = {
  background: "rgba(37, 39, 43, 0.95)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  backdropFilter: "blur(10px)",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 500,
};

export type AppNotifyParams = Omit<ArgsProps, "message">;

const getIcon = (type: string): React.ReactNode => {
  const iconStyle = { fontSize: 20 };
  switch (type) {
    case "success":
      return React.createElement(CheckCircleFilled, {
        style: { ...iconStyle, color: "#4CAF50" },
      });
    case "error":
      return React.createElement(CloseCircleFilled, {
        style: { ...iconStyle, color: "#FF5B37" },
      });
    case "warning":
      return React.createElement(WarningFilled, {
        style: { ...iconStyle, color: "#FAAD14" },
      });
    default:
      return React.createElement(InfoCircleFilled, {
        style: { ...iconStyle, color: "#1890FF" },
      });
  }
};

export const notify = (message: string, params: AppNotifyParams) => {
  const { type = "info" } = params;

  notification.open({
    description: message,
    showProgress: true,
    pauseOnHover: true,
    placement: "topRight",
    duration: 4,
    style: baseStyle,
    icon: getIcon(type),
    className: "nym-notification",
    message: type.toUpperCase(),
    ...params,
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
