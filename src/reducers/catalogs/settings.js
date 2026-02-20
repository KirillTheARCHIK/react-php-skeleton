import { isLoaded } from "actions";
import { LOAD_SYSTEM_SETTINGS } from "actions/catalogs/settings/types";

const initialState = {
  values: {
    tech_taxi: { availability_colors: {} },
  },
  total: 0,
  loading: false,
};

const systemSettings = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_SYSTEM_SETTINGS: {
      return { ...state, loading: true };
    }
    case isLoaded(LOAD_SYSTEM_SETTINGS, true): {
      const newState = {
        ...state,
        values: payload,
        loading: false,
      };
      return newState;
    }
    case isLoaded(LOAD_SYSTEM_SETTINGS, false): {
      return { ...state, loading: false };
    }
    default: {
      return state;
    }
  }
};

export default systemSettings;
