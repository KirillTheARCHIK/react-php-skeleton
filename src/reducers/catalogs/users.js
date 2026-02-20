import { isLoaded } from "actions";
import {
  LOAD_USERS,
  LOAD_PARTICIPANT_USERS,
} from "actions/catalogs/users/types";

const initialState = { entries: [], total: 0, loading: false };

const users = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_USERS: {
      const newState = { ...state, loading: true };
      return newState;
    }
    case isLoaded(LOAD_USERS, true): {
      const newState = {
        ...state,
        total: payload.total,
        entries: payload.entries,
        loading: false,
      };
      return newState;
    }
    case isLoaded(LOAD_USERS, false): {
      const newState = { ...state, loading: false };
      return newState;
    }
    case LOAD_PARTICIPANT_USERS: {
      const newState = { ...state, loading: true };
      return newState;
    }
    case isLoaded(LOAD_PARTICIPANT_USERS, true): {
      const newState = {
        ...state,
        total: payload.total,
        entries: payload.entries,
        loading: false,
      };
      return newState;
    }
    case isLoaded(LOAD_PARTICIPANT_USERS, false): {
      const newState = { ...state, loading: false };
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default users;
