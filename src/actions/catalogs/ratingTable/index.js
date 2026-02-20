import * as types from "./types";

export const loadRatingTable = (values) => ({
  type: types.LOAD_RATING_TABLE,
  payload: values,
});
