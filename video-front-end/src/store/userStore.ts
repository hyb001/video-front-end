import { create } from "zustand";
import { persist } from "zustand/middleware";
import { message } from "antd";
import authApi from "@/request/apis/auth";
import type { LoginUser } from "@/types/auth";
import { showToast } from "@/components/MessageToast";
// import { getWorkflow } from "@/request/apis/workFlow"

interface SpaceInfo {
  id: number;
  name: string;
  description: string;
  owner_id: number;
}

interface UserInfo {
  user: LoginUser;
  space: SpaceInfo[];
}

interface UserState {
  token: string | null;
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  login: (phone: string, code: string) => Promise<void>;
  register: (
    name: string,
    phone: string,
    email: string,
    code: string
  ) => Promise<void>;
  sendSms: (phone: string, type: string) => Promise<void>;
  logout: () => void;
  //   updateUserInfo: (data: Partial<UserInfo>) => Promise<void>;
}
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      userInfo: null,
      space: [],
      isLoggedIn: false,

      login: async (phone: string, code: string) => {
        try {
          const res = await authApi.login({
            phone,
            code,
            type: "login",
          });
          if (
            res.code === 0 &&
            res.data.access_token &&
            res.data.user &&
            res.data.space
          ) {
            // localStorage.setItem("token", String(res.data.access_token));
            const userInfo = {
              user: res.data.user,
              space: res.data.space,
            };
            set({
              token: String(res.data.access_token),
              userInfo: userInfo,
              isLoggedIn: true,
            });
            showToast("登录成功", "success");
          } else {
            message.error(res.message || "登录失败");
            throw new Error(res.message || "登录失败");
          }
        } catch (error) {
          console.error("登录失败:", error);
          message.error("登录失败，请重试");
          throw error;
        }
      },

      register: async (
        name: string,
        phone: string,
        email: string,
        code: string
      ) => {
        try {
          const res = await authApi.register({
            name,
            phone,
            email,
            type: "register",
            code,
          });
          if (res.code === 0) {
            showToast("注册成功", "success");
          } else {
            message.error(res.message || "注册失败");
            throw new Error(res.message || "注册失败");
          }
        } catch (error) {
          console.error("注册失败:", error);
          message.error("注册失败，请重试");
          throw error;
        }
      },

      sendSms: async (phone: string, type: string) => {
        try {
          const res = await authApi.sendSms({ phone, type });
          if (res.code === 0) {
            message.success("验证码已发送");
          } else {
            message.error(res.message || "验证码发送失败");
            throw new Error(res.message || "验证码发送失败");
          }
        } catch (error) {
          console.error("发送验证码失败:", error);
          message.error("发送验证码失败，请重试");
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
          userInfo: null,
          isLoggedIn: false,
        });
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo,
      }),
    }
  )
);
