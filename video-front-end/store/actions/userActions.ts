import { SET_USER, CLEAR_USER } from "../types/userTypes";
import { CoreUser } from "@/types/auth";

export const setUser = (user: CoreUser) => ({
  type: SET_USER,
  payload: user,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});
