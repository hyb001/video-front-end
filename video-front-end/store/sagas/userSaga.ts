import { takeLatest } from "redux-saga/effects";
// import { clearUser } from "../actions/userActions";
import { CLEAR_ERROR } from "../types/errorTypes";

export function* userSaga() {
  yield takeLatest(CLEAR_ERROR, function* () {});
}
