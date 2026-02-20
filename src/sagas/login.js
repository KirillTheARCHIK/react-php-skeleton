import { call, put } from "redux-saga/effects";

import { dispatchSuccess, dispatchFailed } from "actions";
import * as services from "services/login";
import { resetAuthorize } from "actions/login";

export function* login({ type, payload, meta: { resolve, reject } }) {
  const loginUser = yield call(services.login, payload);

  if (loginUser.name) {
    resolve();
    yield dispatchSuccess(type, loginUser);
  } else {
    reject({
      login,
      status: loginUser.status,
    });
    yield dispatchFailed(type);
  }
}

export function* logout({ type }) {
  // const logoutUser = yield call(services.logout);
  // if (logoutUser === "opaqueredirect") {
  yield put(resetAuthorize());
  yield dispatchSuccess(type);
  // payload.push("/");
  // }
}

export function* getUser({ type }) {
  const user = yield call(services.getUser);

  if (Object.keys(user).length) {
    yield dispatchSuccess(type, user);
  } else {
    yield dispatchFailed(type);
  }
}

export function* impersonateUser({ payload: { username } }) {
  yield call(services.impersonateUser, username);
}
