import { put } from "redux-saga/effects";

const SUCCESS_POSTFIX = "_SUCCESS";
const FAILED_POSTFIX = "_FAILED";

export const isLoaded = (actionType, state) =>
  state ? actionType + SUCCESS_POSTFIX : actionType + FAILED_POSTFIX;

export const dispatch = (type, payload) => put({ type, payload });
export const dispatchSuccess = (type, payload) =>
  dispatch(isLoaded(type, true), payload);
export const dispatchFailed = (type, payload) =>
  dispatch(isLoaded(type, false), payload);
