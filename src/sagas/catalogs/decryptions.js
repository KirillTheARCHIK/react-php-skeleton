import { call } from "redux-saga/effects";

import { dispatchFailed, dispatchSuccess } from "actions";
import * as services from "services/catalogs/decryption";
import { TEXT_ERROR } from "constants/errors";
import { errorChecking } from "helpers/saga";

export function* getDecryptions({ type, payload }) {
  const constants = yield call(services.getDecryptions, payload);
  if (constants && !constants.error) yield dispatchSuccess(type, constants);
  else yield dispatchFailed(type);
}

export function* getDecryption({ type, payload }) {
  const constant = yield call(services.getDecryption, payload);
  if (constant && !constant.error) yield dispatchSuccess(type, constant);
  else yield dispatchFailed(type);
}

export function* updateDecryption({
  type,
  payload,
  meta: { resolve, reject },
}) {
  const updatedDecryption = yield call(services.updateDecryption, payload);
  if (errorChecking(updatedDecryption)) {
    yield dispatchSuccess(type, updatedDecryption);
    resolve();
  } else {
    yield dispatchFailed(type);
    reject({
      error: updatedDecryption?.error || TEXT_ERROR,
      status: updatedDecryption.status,
    });
  }
}
