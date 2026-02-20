import { call } from "redux-saga/effects";

import { dispatchSuccess, dispatchFailed } from "actions";
import * as services from "services/catalogs/userRoles";

export function* loadUserRoles({ type }) {
  const data = yield call(services.loadUserRoles);

  if (data && !data.error) {
    yield dispatchSuccess(type, data);
  } else yield dispatchFailed(type);
}
