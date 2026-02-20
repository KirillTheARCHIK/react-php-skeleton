import * as types from "./types";

export const loadFilterTemplatesByCatalogSlug = (catalogSlug, values) => ({
  type: types.LOAD_FILTER_TEMPLATES_BY_CATALOG_SLUG,
  payload: { catalogSlug, values },
});

export const createFilterTemplate = (values, meta) => ({
  type: types.CREATE_FILTER_TEMPLATE,
  payload: values,
  meta,
});

export const updateFilterTemplate = (values, id, meta) => ({
  type: types.UPDATE_FILTER_TEMPLATE,
  payload: { values, id },
  meta,
});

export const deleteFilterTemplate = (id, catalogSlug) => ({
  type: types.DELETE_FILTER_TEMPLATE,
  payload: { id, catalogSlug },
});
