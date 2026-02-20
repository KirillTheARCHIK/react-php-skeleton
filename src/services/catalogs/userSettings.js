import { fetchRequest } from "helpers/fetchRequest";
import { groupDelete } from "helpers/groupDelete";

export const URL = "/api/v1/catalogs/user_settings";

export const loadUserSettings = (values) => {
  return fetchRequest(`${URL}?` + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};

export const loadUserSetting = (id) => {
  return fetchRequest(`${URL}/${id}`)
    .then((json) => json)
    .catch((e) => e);
};

export const createUserSetting = (values) => {
  return fetchRequest(URL, { method: "post", body: values })
    .then((json) => json)
    .catch((e) => e);
};

export const updateUserSetting = ({ id, values }) => {
  return fetchRequest(`${URL}/` + id, {
    method: "put",
    body: values,
  })
    .then((json) => json)
    .catch((e) => e);
};

export const deleteUserSetting = ({ ids }) => {
  return fetchRequest(`${URL}?${groupDelete(ids)}`, {
    method: "delete",
  })
    .then((json) => json)
    .catch((e) => e);
};
