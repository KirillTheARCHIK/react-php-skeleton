import * as types from "./types";

export const loadGroupData = (values) => ({
  type: types.LOAD_GROUP_DATA,
  payload: values,
});

export const loadGroupEntryData = (values) => ({
  type: types.LOAD_GROUP_ENTRY_DATA,
  payload: values,
});
