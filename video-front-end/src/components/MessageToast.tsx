import React, { useEffect } from "react";
import { Alert } from "antd";
import ReactDOM from "react-dom/client";
import successIcon from "@/assets/images/icons/success.png";
import errorIcon from "@/assets/images/icons/error.png";

interface MessageToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

const getCustomIcon = (type: string) => {
  let iconSrc = "";
  if (type === "success") iconSrc = successIcon;
  if (type === "error") iconSrc = errorIcon;
  if (!iconSrc) return undefined;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <img
        src={iconSrc}
        alt={type}
        style={{ width: 20, height: 20, borderRadius: "50%" }}
      />
    </span>
  );
};

const MessageToast: React.FC<MessageToastProps> = ({
  message,
  type = "info",
  duration = 2000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 50,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        minWidth: 111,
        maxWidth: "80vw",
      }}
    >
      <Alert
        message={message}
        type={type}
        showIcon
        icon={getCustomIcon(type)}
        style={{
          fontSize: 14,
          borderRadius: 8,
          padding: "12px 16px",
          textAlign: "center",
          background:
            type === "success"
              ? "var(--100, #1433FE)"
              : type === "error"
              ? "var(--100, #F27923)"
              : undefined,
          boxShadow:
            type === "success"
              ? "0px 6px 25px 0px rgba(20, 51, 254, 0.20)"
              : type === "error"
              ? "0px 6px 25px 0px rgba(242, 121, 35, 0.20)"
              : undefined,
          color: "#fff",
        }}
      />
    </div>
  );
};

export function showToast(
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  duration: number = 2000
) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);

  const handleClose = () => {
    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 100); // 延迟卸载，防止动画丢帧
  };

  root.render(
    <MessageToast
      message={message}
      type={type}
      duration={duration}
      onClose={handleClose}
    />
  );
}

export default MessageToast;
