import * as types from "./types";

export const setMapParams = (values) => ({
  type: types.SET_MAP_PARAMS,
  payload: values,
});

export const clearMapParams = () => ({
  type: types.CLEAR_MAP_PARAMS,
});
