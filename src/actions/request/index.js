import * as types from "./types";

export const setRequest = (request) => ({
  type: types.SET_REQUEST,
  payload: request,
});

export const clearRequest = () => ({
  type: types.CLEAR_REQUEST,
});
