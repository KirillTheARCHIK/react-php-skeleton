import * as types from "./types";

export const loadRoles = (values) => ({
  type: types.LOAD_ROLES,
  payload: values,
});

export const createRole = (values, meta) => ({
  type: types.CREATE_ROLE,
  payload: values,
  meta,
});

export const updateRole = (values, id, meta) => ({
  type: types.UPDATE_ROLE,
  payload: { values, id },
  meta,
});

export const deleteRole = (idArray, isAll) => ({
  type: types.DELETE_ROLE,
  payload: { idArray, isAll },
});
