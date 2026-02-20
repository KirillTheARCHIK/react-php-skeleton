import { call, put } from "redux-saga/effects";

import { dispatchSuccess, dispatchFailed } from "actions";
import { loadSystemSettings as loadSystemSettingsAC } from "actions/catalogs/settings";
import * as services from "services/catalogs/settings";
import { getTextError } from "helpers/saga";

export function* loadSystemSettings({ type }) {
  const data = yield call(services.loadSystemSettings);
  if (data && !data.error) {
    yield dispatchSuccess(type, data);
  } else yield dispatchFailed(type);
}

export function* updateSystemSettings({
  type,
  payload,
  meta: { resolve, reject },
}) {
  const data = yield call(services.updateSystemSettings, payload);
  if (data && !data.error) {
    yield put(loadSystemSettingsAC());
    resolve();
  } else {
    yield dispatchFailed(type);
    reject({ error: getTextError(data), status: data.status });
  }
}
