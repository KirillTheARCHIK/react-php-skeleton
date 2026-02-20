import { isLoaded } from "actions";
import { LOAD_FILTER_TEMPLATES_BY_CATALOG_SLUG } from "actions/filterTemplates/types";

const initialState = { entries: [], total: 0, loading: false };

const filterTemplates = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_FILTER_TEMPLATES_BY_CATALOG_SLUG: {
      return { ...state, loading: true };
    }
    case isLoaded(LOAD_FILTER_TEMPLATES_BY_CATALOG_SLUG, true): {
      const newState = {
        ...state,
        total: payload.total,
        entries: payload.entries,
        loading: false,
      };
      return newState;
    }
    case isLoaded(LOAD_FILTER_TEMPLATES_BY_CATALOG_SLUG, false): {
      return { ...state, loading: false };
    }
    default: {
      return state;
    }
  }
};

export default filterTemplates;
