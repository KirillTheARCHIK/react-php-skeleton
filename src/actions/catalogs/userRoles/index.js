import * as types from "./types";

export const loadUserRoles = () => ({
  type: types.LOAD_USER_ROLES,
});

export const clearUserRoles = () => ({
  type: types.CLEAR_USER_ROLES,
});
