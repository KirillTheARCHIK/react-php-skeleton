import { call } from "redux-saga/effects";

import { dispatchSuccess, dispatchFailed } from "actions";
import * as services from "services/group";

export function* loadGroupData({ type, payload }) {
  const groupData = yield call(services.loadGroupData, payload);
  if (groupData && !groupData.error) {
    yield dispatchSuccess(type, groupData);
  } else yield dispatchFailed(type);
}

export function* loadGroupEntryData({ type, payload }) {
  const groupEntryData = yield call(services.loadGroupEntryData, payload);
  if (groupEntryData && !groupEntryData.error) {
    yield dispatchSuccess(type, { groupEntryData, value: payload.value });
  } else yield dispatchFailed(type);
}
