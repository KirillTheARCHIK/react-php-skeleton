import {
  RESET_PARAMS,
  SET_FILTER,
  SET_GROUP,
  SET_PAGINATION,
  SET_SEARCH,
  SET_SORT,
  CANT_RESET_PARAMS,
  INIT_PARAMS_WITH_USER_SETTINGS,
} from "actions/requestParams/types";

const initialState = {};

const requestParams = (state = initialState, { type, payload }) => {
  switch (type) {
    case CANT_RESET_PARAMS: {
      const { key, value } = payload;
      return {
        ...state,
        cantResetParams: {
          key,
          value,
        },
      };
    }

    case SET_PAGINATION: {
      return {
        ...state,
        [payload.key]: {
          ...state[payload.key],
          paginationParams: payload.values,
        },
      };
    }
    case SET_FILTER: {
      return {
        ...state,
        [payload.key]: { ...state[payload.key], filterParams: payload.values },
      };
    }
    case SET_SORT: {
      return {
        ...state,
        [payload.key]: { ...state[payload.key], sortParams: payload.values },
      };
    }
    case SET_SEARCH: {
      return {
        ...state,
        [payload.key]: { ...state[payload.key], searchParams: payload.values },
      };
    }
    case SET_GROUP: {
      return {
        ...state,
        [payload.key]: { ...state[payload.key], groupParams: payload.values },
      };
    }
    case RESET_PARAMS: {
      if (state?.cantResetParams?.value) {
        return {
          ...state,
        };
      }
      return initialState;
    }
    case INIT_PARAMS_WITH_USER_SETTINGS: {
      if (
        state.cantResetParams &&
        state.cantResetParams.key === payload.key &&
        state.cantResetParams.value
      ) {
        return { ...state };
      }
      return {
        ...state,
        [payload.key]: payload.value,
        cantResetParams: {
          key: payload.key,
          value: false,
        },
      };
    }

    default: {
      return state;
    }
  }
};

export default requestParams;
