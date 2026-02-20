import { isLoaded } from "actions";
import {
  LOAD_USER_ROLES,
  CLEAR_USER_ROLES,
} from "actions/catalogs/userRoles/types";

const initialState = { entries: [], loading: false };

const userRoles = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_USER_ROLES: {
      const newState = { ...state, loading: true };
      return newState;
    }
    case isLoaded(LOAD_USER_ROLES, true): {
      const newState = {
        ...state,
        entries: payload,
        loading: false,
      };
      return newState;
    }
    case isLoaded(LOAD_USER_ROLES, false): {
      const newState = { ...state, loading: false };
      return newState;
    }
    case CLEAR_USER_ROLES: {
      const newState = initialState;
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default userRoles;
