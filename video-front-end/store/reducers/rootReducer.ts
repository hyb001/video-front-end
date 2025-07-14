import { combineReducers } from "redux";
import { errorReducer } from "./errorReducer";
import { userReducer } from "./userReducer";

const rootReducer = combineReducers({
  error: errorReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
