import { call } from "redux-saga/effects";

import { dispatchSuccess, dispatchFailed } from "actions";
import * as services from "services/reports";

export function* loadReportGrouped({ type, payload }) {
  const reportGrouped = yield call(services.loadReportGrouped, payload);
  if (reportGrouped && !reportGrouped.error) {
    yield dispatchSuccess(type, reportGrouped);
  } else yield dispatchFailed(type);
}

export function* loadReportUngrouped({ type, payload }) {
  const reportUngrouped = yield call(services.loadReportUngrouped, payload);
  if (reportUngrouped && !reportUngrouped.error) {
    yield dispatchSuccess(type, reportUngrouped);
  } else yield dispatchFailed(type);
}

export function* loadReportGsm({ type, payload }) {
  const reportGsm = yield call(services.loadReportGsm, payload);
  if (reportGsm && !reportGsm.error) {
    yield dispatchSuccess(type, reportGsm);
  } else yield dispatchFailed(type);
}
