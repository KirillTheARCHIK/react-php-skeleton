import { fetchRequest } from "helpers/fetchRequest";

const URL = "/api/v1/catalogs/message_groups";

export const loadMessageGroups = (values) => {
  return fetchRequest(`${URL}?` + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};
