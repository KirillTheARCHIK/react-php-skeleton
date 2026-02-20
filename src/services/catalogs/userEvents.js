import { fetchRequest } from "helpers/fetchRequest";

export const URL = "/api/v1/logs/userevents";

export const loadUserEvents = (values) => {
  return fetchRequest(`${URL}?` + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};

export const loadUserEvent = (id) => {
  return fetchRequest(`${URL}/${id}`)
    .then((json) => json)
    .catch((e) => e);
};
