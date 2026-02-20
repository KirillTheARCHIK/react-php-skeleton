import { isLoaded } from "actions";
import { LOAD_ROLES } from "actions/catalogs/roles/types";

const initialState = { entries: [], total: 0, loading: false };

const roles = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_ROLES: {
      const newState = { ...state, loading: true };
      return newState;
    }
    case isLoaded(LOAD_ROLES, true): {
      const newState = {
        ...state,
        total: payload.total,
        entries: payload.entries,
        loading: false,
      };
      return newState;
    }
    case isLoaded(LOAD_ROLES, false): {
      const newState = { ...state, loading: false };
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default roles;
