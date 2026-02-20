import { fetchRequest } from "helpers/fetchRequest";
import { groupDelete } from "helpers/groupDelete";

export const URL = "/api/v1/catalogs/filter_templates";

export const loadFilterTemplatesByCatalogSlug = ({ catalogSlug, values }) => {
  return fetchRequest(`${URL}/catalog/${catalogSlug}?${new URLSearchParams(values)}`)
    .then((json) => json)
    .catch((e) => e);
};

export const loadFilterTemplate = (id) => {
  return fetchRequest(`${URL}/${id}`)
    .then((json) => json)
    .catch((e) => e);
};

export const createFilterTemplate = (values) => {
  return fetchRequest(URL, { method: "post", body: values })
    .then((json) => json)
    .catch((e) => e);
};

export const updateFilterTemplate = ({ id, values }) => {
  return fetchRequest(`${URL}/` + id, {
    method: "put",
    body: values,
  })
    .then((json) => json)
    .catch((e) => e);
};

export const deleteFilterTemplate = (id) => {
  return fetchRequest(`${URL}?${groupDelete(id)}`, {
    method: "delete",
  })
    .then((json) => json)
    .catch((e) => e);
};
