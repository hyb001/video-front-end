import {
  UserState,
  UserActionTypes,
  SET_USER,
  CLEAR_USER,
} from "../types/userTypes";

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

export const userReducer = (
  state = initialState,
  action: UserActionTypes
): UserState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
