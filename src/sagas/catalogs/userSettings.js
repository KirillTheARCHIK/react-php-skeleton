import { call, put } from "redux-saga/effects";

import { dispatchFailed, dispatchSuccess } from "actions";
import { setCheckedCheckboxes } from "actions/checkboxes";

import * as services from "services/catalogs/userSettings";
import { errorChecking, getTextError } from "helpers/saga";
import { loadUserSettings as loadUserSettingsAC } from "actions/catalogs/userSettings";

export function* loadUserSettings({ type, payload }) {
  const data = yield call(services.loadUserSettings, payload);
  if (data && !data.error) {
    yield dispatchSuccess(type, data);
  } else yield dispatchFailed(type);
}

export function* createUserSetting({
  type,
  payload,
  meta: { resolve, reject },
}) {
  const data = yield call(services.createUserSetting, payload);

  if (errorChecking(data)) {
    yield dispatchSuccess(type, data);
    yield put(loadUserSettingsAC());
    resolve();
  } else {
    yield dispatchFailed(type);
    reject({
      error: getTextError(data),
      status: data.status,
    });
  }
}

export function* updateUserSetting({
  type,
  payload,
  meta: { resolve, reject },
}) {
  const data = yield call(services.updateUserSetting, payload);
  if (errorChecking(data)) {
    yield dispatchSuccess(type, data);
    yield put(loadUserSettingsAC());
    resolve();
  } else {
    yield dispatchFailed(type);
    reject({
      error: getTextError(data),
      status: data.status,
    });
  }
}

export function* deleteUserSetting({
  type,
  payload,
  meta: { resolve, reject },
}) {
  const data = yield call(services.deleteUserSetting, payload);
  if (data.ok && !data.error) {
    yield dispatchSuccess(type, data);
    yield put(loadUserSettingsAC());
    yield put(setCheckedCheckboxes([]));
    resolve();
  } else {
    yield dispatchFailed(type, data.error);
    reject(getTextError(data));
  }
}
