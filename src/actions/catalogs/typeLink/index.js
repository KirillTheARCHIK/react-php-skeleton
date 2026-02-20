import * as types from "./types";

export const loadTypeLinks = (values) => ({
  type: types.LOAD_TYPE_LINKS,
  payload: values,
});

export const updateTypeLink = (values, id, meta) => ({
  type: types.UPDATE_TYPE_LINK,
  payload: { values, id },
  meta,
});
