import { fetchRequest } from "helpers/fetchRequest";
import { groupDelete } from "helpers/groupDelete";

const URL = "/api/v1/administration/user_groups";

export const loadRoles = (values) => {
  return fetchRequest(`${URL}?` + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};

export const loadRole = (id) => {
  return fetchRequest(`${URL}/${id}`)
    .then((json) => json)
    .catch((e) => e);
};

export const createRole = (values) => {
  return fetchRequest(URL, { method: "post", body: values })
    .then((json) => json)
    .catch((e) => e);
};

export const updateRole = ({ id, values }) => {
  return fetchRequest(`${URL}/` + id, {
    method: "put",
    body: values,
  })
    .then((json) => json)
    .catch((e) => e);
};

export const deleteRole = ({ idArray, isAll }) => {
  return fetchRequest(`${URL}?${groupDelete(idArray, isAll)}`, {
    method: "delete",
  })
    .then((json) => json)
    .catch((e) => e);
};

export const loadRolesByType = (values) => {
  return fetchRequest(`/api/v1/roles?` + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};
