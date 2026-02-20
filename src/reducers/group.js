import { isLoaded } from "actions";
import { LOAD_GROUP_DATA, LOAD_GROUP_ENTRY_DATA } from "actions/group/types";

const initialState = {
  total: 0,
  entries: [],
  loading: false,
};

const group = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_GROUP_DATA: {
      return { ...state, loading: true };
    }
    case isLoaded(LOAD_GROUP_DATA, true): {
      return {
        ...state,
        loading: false,
        total: payload.total,
        entries: payload.entries,
      };
    }
    case isLoaded(LOAD_GROUP_DATA, false): {
      return { ...state, loading: false };
    }
    case LOAD_GROUP_ENTRY_DATA: {
      return {
        ...state,
        [payload.value]: {
          entryLoading: true,
        },
      };
    }
    case isLoaded(LOAD_GROUP_ENTRY_DATA, true): {
      return {
        ...state,
        [payload.value]: {
          entryLoading: false,
          entryTotal: payload.groupEntryData.total,
          entry: payload.groupEntryData.entries,
        },
      };
    }
    case isLoaded(LOAD_GROUP_ENTRY_DATA, false): {
      return {
        ...state,
        [payload.value]: {
          entryLoading: false,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default group;
