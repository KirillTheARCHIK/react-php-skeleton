import * as types from "./types";

export const loadSystemSettings = () => ({
  type: types.LOAD_SYSTEM_SETTINGS,
});

export const updateSystemSettings = (values, meta) => ({
  type: types.UPDATE_SYSTEM_SETTINGS,
  payload: values,
  meta,
});
