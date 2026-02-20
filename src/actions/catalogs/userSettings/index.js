import * as types from "./types";

export const loadUserSettings = (values) => ({
  type: types.LOAD_USER_SETTINGS,
  payload: values,
});

export const createUserSetting = (values, meta) => ({
  type: types.CREATE_USER_SETTING,
  payload: values,
  meta,
});

export const updateUserSetting = (id, values, meta) => ({
  type: types.UPDATE_USER_SETTING,
  payload: { values, id },
  meta,
});

export const deleteUserSetting = (ids, meta) => ({
  type: types.DELETE_USER_SETTING,
  payload: { ids },
  meta,
});
