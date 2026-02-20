import { call, select, put } from "redux-saga/effects";

import { dispatchSuccess, dispatchFailed } from "actions";
import * as services from "services/catalogs/users";
import { getTextError, errorChecking, loadAction } from "helpers/saga";
import { loadUsers as loadUsersAC } from "actions/catalogs/users";
import { setCheckedCheckboxes } from "actions/checkboxes";
import { getUser } from "actions/login";

export function* loadUsers({ type, payload }) {
  const users = yield call(services.loadUsers, payload);
  if (users && !users.error) {
    yield dispatchSuccess(type, users);
  } else yield dispatchFailed(type);
}

export function* createUser({ type, payload, meta: { resolve, reject } }) {
  const createdUser = yield call(services.createUser, payload);

  if (errorChecking(createdUser)) {
    const requestParamsUsers = yield select(
      (state) => state.requestParams.users
    );
    if (requestParamsUsers) {
      yield loadAction(loadUsersAC, requestParamsUsers);
    }

    resolve();
  } else {
    yield dispatchFailed(type);
    reject({ error: getTextError(createdUser), status: createdUser.status });
  }
}

export function* updateUser({ type, payload, meta: { resolve, reject } }) {
  const updatedUser = yield call(services.updateUser, payload);
  if (errorChecking(updatedUser)) {
    const requestParamsUsers = yield select(
      (state) => state.requestParams.users
    );
    if (requestParamsUsers) {
      yield loadAction(loadUsersAC, requestParamsUsers);
    }

    resolve();
  } else {
    yield dispatchFailed(type);
    reject({ error: getTextError(updatedUser), status: updatedUser.status });
  }
}

export function* deleteUser({ type, payload }) {
  const deletedUser = yield call(services.deleteUser, payload);
  if (deletedUser.ok && !deletedUser.error) {
    const requestParamsUsers = yield select(
      (state) => state.requestParams.users
    );
    if (requestParamsUsers) {
      yield loadAction(loadUsersAC, requestParamsUsers);
    }
    yield put(setCheckedCheckboxes([]));
  } else {
    yield dispatchFailed(type, deletedUser.error);
  }
}

export function* loadParticipantUsers({ type, payload }) {
  const users = yield call(services.loadParticipantUsers, payload);
  if (users && !users.error) {
    yield dispatchSuccess(type, users);
  } else yield dispatchFailed(type);
}

export function* updateUserProfile({ type, payload }) {
  const users = yield call(services.updateUserProfile, payload);
  if (users && !users.error) {
    yield put(getUser());
  } else yield dispatchFailed(type);
}
