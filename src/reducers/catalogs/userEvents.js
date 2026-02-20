import { isLoaded } from "actions";
import { LOAD_USER_EVENTS } from "actions/catalogs/userEvents/types";

const initialState = { entries: [], total: 0, loading: false };

const userEvents = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_USER_EVENTS: {
      const newState = { ...state, loading: true };
      return newState;
    }
    case isLoaded(LOAD_USER_EVENTS, true): {
      const newState = { ...state, loading: false };
      newState.total = payload.total;
      newState.entries = payload.entries;
      return newState;
    }
    case isLoaded(LOAD_USER_EVENTS, false): {
      const newState = { ...state, loading: false };
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default userEvents;
