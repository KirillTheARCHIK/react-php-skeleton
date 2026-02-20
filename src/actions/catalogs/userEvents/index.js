import * as types from "./types";

export const loadUserEvents = (values) => ({
  type: types.LOAD_USER_EVENTS,
  payload: values,
});
