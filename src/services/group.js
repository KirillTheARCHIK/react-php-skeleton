import { fetchRequest } from "helpers/fetchRequest";

export const loadGroupData = ({ url, fieldName, ...values }) => {
  const URL =
    fieldName !== "repairCenter"
      ? `${url}/groups/${fieldName}?`
      : `${url}/groups?`;
  return fetchRequest(URL + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};

export const loadGroupEntryData = ({ url, fieldName, value, ...values }) => {
  const URL =
    fieldName !== "repairCenter"
      ? `${url}/groups/${fieldName}/${value}?`
      : `${url}/groups/${value}?`;
  return fetchRequest(URL + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};
