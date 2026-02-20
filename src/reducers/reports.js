import { isLoaded } from "actions";
import {
  LOAD_REPORT_GROUPED,
  LOAD_REPORT_UNGROUPED,
  LOAD_REPORT_GSM,
} from "actions/reports/types";

const initialState = { entries: [], total: 0, loading: false };

const reports = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_REPORT_GROUPED: {
      const newState = { ...state, loading: true };
      return newState;
    }
    case isLoaded(LOAD_REPORT_GROUPED, true): {
      const newState = {
        ...state,
        total: payload.total,
        entries: payload.entries,
        loading: false,
      };
      return newState;
    }
    case isLoaded(LOAD_REPORT_GROUPED, false): {
      const newState = { ...state, loading: false };
      return newState;
    }
    case LOAD_REPORT_UNGROUPED: {
      const newState = { ...state, loading: true };
      return newState;
    }
    case isLoaded(LOAD_REPORT_UNGROUPED, true): {
      const newState = {
        ...state,
        total: payload.total,
        entries: payload.entries,
        loading: false,
      };
      return newState;
    }
    case isLoaded(LOAD_REPORT_UNGROUPED, false): {
      const newState = { ...state, loading: false };
      return newState;
    }
    case LOAD_REPORT_GSM: {
      const newState = { ...state, loading: true };
      return newState;
    }
    case isLoaded(LOAD_REPORT_GSM, true): {
      const newState = {
        ...state,
        total: payload.total,
        entries: payload.entries,
        loading: false,
      };
      return newState;
    }
    case isLoaded(LOAD_REPORT_GSM, false): {
      const newState = { ...state, loading: false };
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default reports;
