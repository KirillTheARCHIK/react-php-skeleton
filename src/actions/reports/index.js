import * as types from "./types";

export const loadReportGrouped = (values) => ({
  type: types.LOAD_REPORT_GROUPED,
  payload: values,
});

export const loadReportUngrouped = (values) => ({
  type: types.LOAD_REPORT_UNGROUPED,
  payload: values,
});

export const loadReportGsm = (values) => ({
  type: types.LOAD_REPORT_GSM,
  payload: values,
});
