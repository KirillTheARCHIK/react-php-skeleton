import { isLoaded } from "actions";
import { LOGIN, LOGOUT, GET_USER } from "actions/login/types";

const login = (state = null, { type, payload }) => {
  switch (type) {
    case GET_USER:
      return null;
    case isLoaded(GET_USER, true):
    case isLoaded(LOGIN, true): {
      return {
        ...state,
        ...payload,
      };
    }
    case isLoaded(GET_USER, false):
    case isLoaded(LOGOUT, true): {
      return false;
    }
    default: {
      return state;
    }
  }
};

export default login;
