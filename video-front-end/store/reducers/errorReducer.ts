import {
  ErrorState,
  ErrorActionTypes,
  SET_ERROR,
  CLEAR_ERROR,
} from "../types/errorTypes";

const initialState: ErrorState = {
  open: false,
  cmsg: "",
};

export const errorReducer = (
  state = initialState,
  action: ErrorActionTypes
): ErrorState => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        open: true,
        ...action.payload,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        open: false,
        cmsg: "",
      };
    default:
      return state;
  }
};
