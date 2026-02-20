import { call } from "redux-saga/effects";

import { dispatchSuccess, dispatchFailed } from "actions";
import * as services from "services/catalogs/userEvents";

export function* loadUserEvents({ type, payload }) {
  const userEvents = yield call(services.loadUserEvents, payload);
  if (userEvents && !userEvents.error) {
    yield dispatchSuccess(type, userEvents);
  } else yield dispatchFailed(type);
}
