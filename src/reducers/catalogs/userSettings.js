import { isLoaded } from "actions";
import { LOAD_USER_SETTINGS } from "actions/catalogs/userSettings/types";

const initialState = { entries: [], total: 0, loading: false };

const userSettings = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_USER_SETTINGS: {
      const newState = { ...state, loading: true };
      return newState;
    }
    case isLoaded(LOAD_USER_SETTINGS, true): {
      const newState = {
        ...state,
        total: payload.total,
        entries: payload.entries,
        loading: false,
      };
      return newState;
    }
    case isLoaded(LOAD_USER_SETTINGS, false): {
      const newState = { ...state, loading: false };
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default userSettings;
