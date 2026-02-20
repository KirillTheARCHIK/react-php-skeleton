import {
  SET_ALL_CHECKED_CHECKBOXES,
  SET_CHECKED_CHECKBOXES,
} from "actions/checkboxes/types";

const initialState = {
  entries: {},
  isAllChecked: false,
};

const checkedCheckboxes = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CHECKED_CHECKBOXES: {
      return { ...state, entries: payload };
    }
    case SET_ALL_CHECKED_CHECKBOXES: {
      return { ...state, isAllChecked: payload };
    }
    default: {
      return state;
    }
  }
};

export default checkedCheckboxes;
