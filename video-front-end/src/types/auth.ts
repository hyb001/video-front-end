import { Response } from ".";

// 发送验证码
export interface SendSmsRequest {
  phone: string;
  type: string; // "login" | "register"
}
export interface SendSmsResponse extends Response {}

// 注册
export interface RegisterRequest {
  name: string;
  phone: string;
  email: string;
  type: string; // "register"
  code: string;
}
export interface RegisterResponse extends Response {}

// 用户信息
export interface LoginUser {
  name: string;
  email: string;
  phone: string;
  create_time: string;
  last_login_time: string;
  id: number;
  avatar?: string;
}

// 空间信息
export interface SpaceInfo {
  name: string;
  description: string;
  owner_id: number;
  id: number;
}

// 登录
export interface LoginRequest {
  phone: string;
  type: string; // "login"
  code: string;
}
export interface LoginResponse extends Response {
  data: {
    user?: LoginUser;
    space?: SpaceInfo[];
    access_token?: string;
    token_type?: string;
    [property: string]: unknown;
  };
}
