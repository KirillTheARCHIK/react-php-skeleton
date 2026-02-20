import * as types from "./types";

export const loadAvailableTags = (values) => ({
  type: types.LOAD_AVAILABLE_TAGS,
  payload: values,
});
