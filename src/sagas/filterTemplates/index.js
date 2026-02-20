import { call, put } from "redux-saga/effects";

import { dispatchSuccess, dispatchFailed } from "actions";
import * as services from "services/filterTemplates";
import { getTextError, errorChecking } from "helpers/saga";
import { loadFilterTemplatesByCatalogSlug as loadFilterTemplatesByCatalogSlugAC } from "actions/filterTemplates";

export function* loadFilterTemplatesByCatalogSlug({ type, payload }) {
  const data = yield call(services.loadFilterTemplatesByCatalogSlug, payload);
  if (data && !data.error) {
    yield dispatchSuccess(type, data);
  } else yield dispatchFailed(type);
}

export function* createFilterTemplate({
  type,
  payload,
  meta: { resolve, reject },
}) {
  const data = yield call(services.createFilterTemplate, payload);

  if (errorChecking(data)) {
    resolve({ data });
  } else {
    yield dispatchFailed(type);
    reject({
      error: getTextError(data),
      status: data.status,
    });
  }
}

export function* updateFilterTemplate({
  type,
  payload,
  meta: { resolve, reject },
}) {
  const data = yield call(services.updateFilterTemplate, payload);
  if (errorChecking(data)) {
    resolve({ data });
  } else {
    yield dispatchFailed(type);
    reject({
      error: getTextError(data),
      status: data.status,
    });
  }
}

export function* deleteFilterTemplate({ type, payload }) {
  const data = yield call(services.deleteFilterTemplate, payload.id);
  if (data.ok && !data.error) {
    yield put(loadFilterTemplatesByCatalogSlugAC(payload.catalogSlug));
  } else {
    yield dispatchFailed(type, data.error);
  }
}
