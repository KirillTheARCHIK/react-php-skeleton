import { call, select, put } from "redux-saga/effects";

import { dispatchSuccess, dispatchFailed } from "actions";
import * as services from "services/catalogs/roles";
import { loadRoles as loadRolesAC } from "actions/catalogs/roles";
import { setCheckedCheckboxes } from "actions/checkboxes";
import { getTextError, errorChecking, loadAction } from "helpers/saga";

export function* loadRoles({ type, payload }) {
  const roles = yield call(services.loadRoles, payload);
  if (roles && !roles.error) {
    yield dispatchSuccess(type, roles);
  } else yield dispatchFailed(type);
}

export function* createRole({ type, payload, meta: { resolve, reject } }) {
  const createdRole = yield call(services.createRole, payload);

  if (errorChecking(createdRole)) {
    resolve();
  } else {
    yield dispatchFailed(type);
    reject({ error: getTextError(createdRole), status: createdRole.status });
  }
}

export function* updateRole({ type, payload, meta: { resolve, reject } }) {
  const updatedRole = yield call(services.updateRole, payload);
  if (errorChecking(updatedRole)) {
    resolve();
  } else {
    yield dispatchFailed(type);
    reject({ error: getTextError(updatedRole), status: updatedRole.status });
  }
}

export function* deleteRole({ type, payload }) {
  const deletedRole = yield call(services.deleteRole, payload);
  if (deletedRole.ok && !deletedRole.error) {
    const requestParams = yield select((state) => state.requestParams.roles);
    yield loadAction(loadRolesAC, requestParams);
    yield put(setCheckedCheckboxes([]));
  } else {
    yield dispatchFailed(type, deletedRole.error);
  }
}
