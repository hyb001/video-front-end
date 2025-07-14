import { CoreUser } from "@/types/auth";

export interface UserState {
  user: CoreUser | null;
  isAuthenticated: boolean;
}

export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";

interface SetUserAction {
  type: typeof SET_USER;
  payload: CoreUser;
}

interface ClearUserAction {
  type: typeof CLEAR_USER;
}

export type UserActionTypes = SetUserAction | ClearUserAction;
