import axios, { AxiosError } from "axios";
import { useErrorStore } from "@/store/errorStore";
import { useUserStore } from "@/store/userStore";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 1000 * 30,
});

const whiteList = ["accounts/send/sms", "accounts/login", "accounts/register"];

const isInWhiteList = (url: string) => {
  return whiteList.some((item) => {
    if (typeof item === "string") {
      return url?.startsWith(item);
    }
    return false;
  });
};

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  function (config) {
    if (!isInWhiteList(config.url as string)) {
      const token = useUserStore.getState().token;
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: AxiosError) {
    handleCatchError(error);
    return Promise.reject(error);
  }
);

function handleCatchError(error: AxiosError) {
  let cmsg = "网络异常，请稍后再试！";
  if (error.response) {
    const responseData = error.response.data as {
      code?: number;
      message?: string;
    };
    if (responseData?.code !== 0) {
      cmsg = responseData?.message || "未知错误";
    } else {
      switch (error.response.status) {
        case 400:
          cmsg = "请求错误";
          break;
        case 401:
          cmsg = "未授权，请登录";
          break;
        case 404:
          cmsg = "请求的资源未找到";
          break;
        case 500:
          cmsg = "服务器内部错误";
          break;
        case 429:
          cmsg = "请求过于频繁，请稍后再试！";
          break;
        default:
          cmsg = "服务器错误";
          break;
      }
    }
  } else if (error.request) {
    cmsg = "请求超时，请检查网络连接";
  }
  // 使用 zustand 的 error store
  useErrorStore.getState().setError({
    cmsg,
    code: error.code,
    message: error.message,
    status: error.status,
    name: error.name,
  });
}

export default axiosInstance;
