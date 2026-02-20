import * as types from "./types";

export const loadSubdivisions = (values) => ({
  type: types.LOAD_SUBDIVISIONS,
  payload: values,
});
