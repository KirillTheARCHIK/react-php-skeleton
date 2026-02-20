import { SET_MAP_PARAMS, CLEAR_MAP_PARAMS } from "actions/mapParams/types";

const initialState = {};

const mapParams = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_MAP_PARAMS: {
      return { ...state, ...payload };
    }
    case CLEAR_MAP_PARAMS: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export default mapParams;
