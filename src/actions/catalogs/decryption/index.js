import * as types from "./types";

export const getDecryptions = (values) => ({
  type: types.GET_DECRYPTIONS,
  payload: values,
});

export const getDecryption = (id) => ({
  type: types.GET_DECRYPTION,
  payload: { id },
});

export const updateDecryption = (id, values, meta) => ({
  type: types.UPDATE_DECRYPTION,
  payload: { id, values },
  meta,
});
export const setDecryptionId = (id) => ({
  type: types.SET_DECRYPTION_ID,
  payload: { id },
});

export const setStationId = (values) => ({
  type: types.STATION_ID,
  payload: values,
});

export const getDecryptingResult = (values) => ({
  type: types.DECRYPTING_RESULT,
  payload: values,
});
