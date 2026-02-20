import { INITIAL_VALUES_STATE } from "constants/request";
import { put, select } from "redux-saga/effects";
import { initParamsWithUserSettings } from "actions/requestParams";

export function* initParams({ payload: { key } }) {
  const userSettings = yield select(
    (state) => state.userSettings?.entries || []
  );

  const numberRowsTable = userSettings.find(
    (item) => item.name === "numberRowsTable"
  );

  const value = INITIAL_VALUES_STATE;
  if (numberRowsTable) {
    value.paginationParams.limit = +numberRowsTable.value;
  }

  yield put(initParamsWithUserSettings(key, value));
}
