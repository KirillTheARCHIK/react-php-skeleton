import * as types from "./types";

export const loadUsers = (values) => ({
  type: types.LOAD_USERS,
  payload: values,
});

export const createUser = (values, meta) => ({
  type: types.CREATE_USER,
  payload: values,
  meta,
});

export const updateUser = (values, id, meta) => ({
  type: types.UPDATE_USER,
  payload: { values, id },
  meta,
});

export const deleteUser = (idArray, isAll, organizationId) => ({
  type: types.DELETE_USER,
  payload: { idArray, isAll, organizationId },
});

export const loadParticipantUsers = (values, participantId) => ({
  type: types.LOAD_PARTICIPANT_USERS,
  payload: { values, participantId },
});

export const updateUserProfile = (values) => ({
  type: types.UPDATE_USER_PROFILE,
  payload: values,
});
