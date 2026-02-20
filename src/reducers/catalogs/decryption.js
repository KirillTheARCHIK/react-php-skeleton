import { isLoaded } from "actions";
import {
  GET_DECRYPTION,
  GET_DECRYPTIONS,
  SET_DECRYPTION_ID,
  UPDATE_DECRYPTION,
  STATION_ID,
  DECRYPTING_RESULT,
} from "actions/catalogs/decryption/types";

const initialState = {
  entries: [],
  total: 0,
  loading: false,
  entry: null,
  entryLoading: false,
  decryptingResult: [],
};

const decryptions = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_DECRYPTIONS: {
      return { ...state, loading: true };
    }
    case isLoaded(GET_DECRYPTIONS, true): {
      return {
        ...state,
        loading: false,
        total: payload.length,
        entries: payload,
      };
    }
    case isLoaded(GET_DECRYPTIONS, false): {
      return { ...state, loading: false };
    }
    case GET_DECRYPTION: {
      return { ...state, entryLoading: true };
    }
    case isLoaded(GET_DECRYPTION, true): {
      return {
        ...state,
        entry: payload,
        entryLoading: false,
      };
    }
    case isLoaded(GET_DECRYPTION, false): {
      return { ...state, entryLoading: false };
    }
    case UPDATE_DECRYPTION: {
      return { ...state, entryLoading: true };
    }
    case isLoaded(UPDATE_DECRYPTION, true): {
      return {
        ...state,
        entry: payload,
        entryLoading: false,
      };
    }
    case isLoaded(UPDATE_DECRYPTION, false): {
      return { ...state, entryLoading: false };
    }
    case SET_DECRYPTION_ID: {
      return {
        ...state,
        decryptionId: payload.id,
      };
    }
    case STATION_ID: {
      return {
        ...state,
        valuesStation: payload,
      };
    }
    case DECRYPTING_RESULT: {
      return {
        ...state,
        decryptingResult: payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default decryptions;
