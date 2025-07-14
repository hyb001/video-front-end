import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import router from "./router";
import "./index.css";
import MessageToast from "@/components/MessageToast";
import { useErrorStore } from "@/store/errorStore";

function App() {
  const { error, clearError } = useErrorStore();

  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
      {error?.cmsg && (
        <MessageToast message={error.cmsg} type="error" onClose={clearError} />
      )}
    </ConfigProvider>
  );
}

export default App;
