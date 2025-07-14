export interface ErrorState {
  open: boolean;
  cmsg: string;
  code?: string;
  message?: string;
  status?: number;
  name?: string;
}

export const SET_ERROR = "SET_ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";

interface SetErrorAction {
  type: typeof SET_ERROR;
  payload: Omit<ErrorState, "open">;
}

interface ClearErrorAction {
  type: typeof CLEAR_ERROR;
}

export type ErrorActionTypes = SetErrorAction | ClearErrorAction;
