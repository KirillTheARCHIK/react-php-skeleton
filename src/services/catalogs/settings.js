import { fetchRequest } from "helpers/fetchRequest";

export const URL = "/api/v1/administration/settings";

export const loadSystemSettings = () => {
  return fetchRequest(`${URL}/`)
    .then((json) => json)
    .catch((e) => e);
};

export const updateSystemSettings = (values) => {
  return fetchRequest(`${URL}/`, {
    method: "put",
    body: values,
  })
    .then((json) => json)
    .catch((e) => e);
};
