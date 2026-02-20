import * as types from "./types";

export const setCheckedCheckboxes = (values) => ({
  type: types.SET_CHECKED_CHECKBOXES,
  payload: values,
});

export const setAllCheckedCheckboxes = (isAllChecked) => ({
  type: types.SET_ALL_CHECKED_CHECKBOXES,
  payload: isAllChecked,
});
