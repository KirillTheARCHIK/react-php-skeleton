import { SET_HISTORY } from "actions/history/types";

const initialState = {};

const history = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_HISTORY: {
      return { ...state, ...payload };
    }
    default: {
      return state;
    }
  }
};

export default history;
