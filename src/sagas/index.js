import { takeEvery } from "redux-saga/effects";

import {
  GET_USER,
  LOGIN,
  LOGOUT,
  LOGIN_SESSION,
  LOGIN_IMPERSONATE,
} from "actions/login/types";
import { getUser, impersonateUser, login, logout } from "./login";

import {
  CREATE_USER,
  DELETE_USER,
  LOAD_USERS,
  UPDATE_USER,
  LOAD_PARTICIPANT_USERS,
  UPDATE_USER_PROFILE,
} from "actions/catalogs/users/types";

import {
  createUser,
  deleteUser,
  loadUsers,
  updateUser,
  loadParticipantUsers,
  updateUserProfile,
} from "./catalogs/users";

import {
  CREATE_ROLE,
  DELETE_ROLE,
  LOAD_ROLES,
  UPDATE_ROLE,
} from "actions/catalogs/roles/types";

import {
  createRole,
  deleteRole,
  loadRoles,
  updateRole,
} from "./catalogs/roles";

import { LOAD_USER_EVENTS } from "actions/catalogs/userEvents/types";

import { loadUserEvents } from "./catalogs/userEvents";

import {
  GET_DECRYPTIONS,
  GET_DECRYPTION,
  UPDATE_DECRYPTION,
} from "actions/catalogs/decryption/types";

import {
  getDecryption,
  getDecryptions,
  updateDecryption,
} from "./catalogs/decryptions";

import {
  LOAD_SYSTEM_SETTINGS,
  UPDATE_SYSTEM_SETTINGS,
} from "actions/catalogs/settings/types";
import { loadSystemSettings, updateSystemSettings } from "./catalogs/settings";

import {
  loadFilterTemplatesByCatalogSlug,
  createFilterTemplate,
  updateFilterTemplate,
  deleteFilterTemplate,
} from "./filterTemplates";

import {
  LOAD_FILTER_TEMPLATES_BY_CATALOG_SLUG,
  CREATE_FILTER_TEMPLATE,
  UPDATE_FILTER_TEMPLATE,
  DELETE_FILTER_TEMPLATE,
} from "actions/filterTemplates/types";

import { loadUserRoles } from "./catalogs/userRoles";
import { LOAD_USER_ROLES } from "actions/catalogs/userRoles/types";

import {
  loadUserSettings,
  createUserSetting,
  updateUserSetting,
  deleteUserSetting,
} from "./catalogs/userSettings";

import {
  LOAD_USER_SETTINGS,
  CREATE_USER_SETTING,
  UPDATE_USER_SETTING,
  DELETE_USER_SETTING,
} from "actions/catalogs/userSettings/types";

import { INIT_PARAMS } from "actions/requestParams/types";
import { initParams } from "sagas/requestParams";

function* rootSaga() {
  yield takeEvery(LOGIN, login);
  yield takeEvery(LOGIN_SESSION, login);
  yield takeEvery(LOGOUT, logout);
  yield takeEvery(GET_USER, getUser);
  yield takeEvery(LOGIN_IMPERSONATE, impersonateUser);

  yield takeEvery(LOAD_USERS, loadUsers);
  yield takeEvery(CREATE_USER, createUser);
  yield takeEvery(UPDATE_USER, updateUser);
  yield takeEvery(DELETE_USER, deleteUser);
  yield takeEvery(LOAD_PARTICIPANT_USERS, loadParticipantUsers);
  yield takeEvery(UPDATE_USER_PROFILE, updateUserProfile);

  yield takeEvery(LOAD_ROLES, loadRoles);
  yield takeEvery(CREATE_ROLE, createRole);
  yield takeEvery(UPDATE_ROLE, updateRole);
  yield takeEvery(DELETE_ROLE, deleteRole);

  yield takeEvery(LOAD_USER_EVENTS, loadUserEvents);

  yield takeEvery(GET_DECRYPTIONS, getDecryptions);
  yield takeEvery(GET_DECRYPTION, getDecryption);
  yield takeEvery(UPDATE_DECRYPTION, updateDecryption);

  yield takeEvery(LOAD_SYSTEM_SETTINGS, loadSystemSettings);
  yield takeEvery(UPDATE_SYSTEM_SETTINGS, updateSystemSettings);

  yield takeEvery(
    LOAD_FILTER_TEMPLATES_BY_CATALOG_SLUG,
    loadFilterTemplatesByCatalogSlug
  );
  yield takeEvery(CREATE_FILTER_TEMPLATE, createFilterTemplate);
  yield takeEvery(UPDATE_FILTER_TEMPLATE, updateFilterTemplate);
  yield takeEvery(DELETE_FILTER_TEMPLATE, deleteFilterTemplate);

  yield takeEvery(LOAD_USER_ROLES, loadUserRoles);

  yield takeEvery(LOAD_USER_SETTINGS, loadUserSettings);
  yield takeEvery(CREATE_USER_SETTING, createUserSetting);
  yield takeEvery(UPDATE_USER_SETTING, updateUserSetting);
  yield takeEvery(DELETE_USER_SETTING, deleteUserSetting);

  yield takeEvery(INIT_PARAMS, initParams);
}

export default rootSaga;
