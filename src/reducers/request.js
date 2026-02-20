import { SET_REQUEST, CLEAR_REQUEST } from "actions/request/types";

const initialState = {};

const request = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_REQUEST: {
      return { ...state, ...payload };
    }
    case CLEAR_REQUEST: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export default request;
