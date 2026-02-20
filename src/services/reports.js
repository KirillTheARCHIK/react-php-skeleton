import { fetchRequest } from "helpers/fetchRequest";

const URL = "/api/v1/reports/common";

export const loadReportGrouped = (values) => {
  return fetchRequest(`${URL}/grouped?` + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};

export const loadReportUngrouped = (values) => {
  return fetchRequest(`${URL}/ungrouped?` + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};

export const loadReportGsm = (values) => {
  return fetchRequest(`/api/v1/reports/gsm?` + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};
