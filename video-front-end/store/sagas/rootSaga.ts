import { all } from "redux-saga/effects";
import { errorSaga } from "./errorSaga";
import { userSaga } from "./userSaga";

export default function* rootSaga() {
  yield all([errorSaga(), userSaga()]);
}
