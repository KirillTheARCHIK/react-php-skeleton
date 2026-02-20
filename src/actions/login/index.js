import * as types from "./types";

export const login = (user, meta) => ({
  type: types.LOGIN,
  payload: user,
  meta,
});

export const loginSession = (user, meta) => ({
  type: types.LOGIN_SESSION,
  payload: user,
  meta,
});

export const logout = (history) => ({
  type: types.LOGOUT,
  payload: history,
});

export const resetAuthorize = () => ({
  type: types.RESET_AUTHORIZE,
});

export const getUser = () => ({
  type: types.GET_USER,
});

export const impersonateUser = (payload, meta) => ({
  type: types.LOGIN_IMPERSONATE,
  payload,
  meta,
});
