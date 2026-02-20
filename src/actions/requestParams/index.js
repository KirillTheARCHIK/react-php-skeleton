import * as types from "./types";

export const setPagination = (values, key) => ({
  type: types.SET_PAGINATION,
  payload: { values, key },
});

export const setFilter = (values, key) => ({
  type: types.SET_FILTER,
  payload: { values, key },
});

export const setSort = (values, key) => ({
  type: types.SET_SORT,
  payload: { values, key },
});

export const setSearch = (values, key) => ({
  type: types.SET_SEARCH,
  payload: { values, key },
});

export const setGroup = (values, key) => ({
  type: types.SET_GROUP,
  payload: { values, key },
});

export const resetParams = () => ({
  type: types.RESET_PARAMS,
});

export const setCantResetParams = (key, value) => ({
  type: types.CANT_RESET_PARAMS,
  payload: { key, value },
});

export const initParams = (key) => ({
  type: types.INIT_PARAMS,
  payload: { key },
});

export const initParamsWithUserSettings = (key, value) => ({
  type: types.INIT_PARAMS_WITH_USER_SETTINGS,
  payload: { key, value },
});
