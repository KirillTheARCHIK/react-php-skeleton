import { LOAD_TYPE_LINKS } from "actions/catalogs/typeLink/types";
import { isLoaded } from "actions";

const initialState = {
  entries: [],
  total: 0,
  loading: false,
};

const typeLink = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_TYPE_LINKS: {
      return { ...state, loading: true };
    }
    case isLoaded(LOAD_TYPE_LINKS, true): {
      return {
        ...state,
        total: payload.total,
        entries: payload.entries,
        loading: false,
      };
    }
    case isLoaded(LOAD_TYPE_LINKS, false): {
      return {
        ...state,
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
};

export default typeLink;
