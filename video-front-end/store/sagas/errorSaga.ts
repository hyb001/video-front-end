import { put, takeLatest } from "redux-saga/effects";
import { clearError } from "../actions/errorActions";
import { SET_ERROR } from "../types/errorTypes";

function* handleError() {
  // 5秒后自动清除错误
  yield new Promise((resolve) => setTimeout(resolve, 5000));
  yield put(clearError());
}

export function* errorSaga() {
  yield takeLatest(SET_ERROR, handleError);
}
