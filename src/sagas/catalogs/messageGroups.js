import { call } from "redux-saga/effects";

import { dispatchSuccess, dispatchFailed } from "actions";
import * as services from "services/catalogs/messageGroups";

export function* loadMessageGroups({ type, payload }) {
  const messageGroups = yield call(services.loadMessageGroups, payload);
  if (messageGroups && !messageGroups.error) {
    yield dispatchSuccess(type, messageGroups);
  } else yield dispatchFailed(type);
}
