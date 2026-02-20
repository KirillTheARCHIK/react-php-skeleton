import { fetchRequest } from "helpers/fetchRequest";

export const URL = "/api/v1/catalogs/positions";

export const loadPositions = (values) => {
  return fetchRequest(`${URL}?` + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};

export const loadPosition = (id) => {
  return fetchRequest(`${URL}/${id}`)
    .then((json) => json)
    .catch((e) => e);
};
