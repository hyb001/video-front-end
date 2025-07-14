import { SET_ERROR, CLEAR_ERROR, ErrorState } from "../types/errorTypes";

export const setError = (error: Omit<ErrorState, "open">) => ({
  type: SET_ERROR,
  payload: error,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});
