import axiosInstance from "..";
import {
  SendSmsRequest,
  SendSmsResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
} from "@/types/auth";

// 发送验证码
export async function sendSms(body: SendSmsRequest): Promise<SendSmsResponse> {
  const result = await axiosInstance.post<SendSmsResponse>(
    "accounts/send/sms",
    body
  );
  return result.data;
}

// 注册
export async function register(body: RegisterRequest): Promise<RegisterResponse> {
  const result = await axiosInstance.post<RegisterResponse>(
    "accounts/register",
    body
  );
  return result.data;
}

// 登录
export async function login(body: LoginRequest): Promise<LoginResponse> {
  const result = await axiosInstance.post<LoginResponse>(
    "accounts/login",
    body
  );
  return result.data;
}

export default { sendSms, register, login };