import { fetchRequest } from "helpers/fetchRequest";
import { groupDelete } from "helpers/groupDelete";

export const URL = "/api/v1/administration/users";

export const loadUsers = () => {
  // return fetchRequest(`${URL}?` + new URLSearchParams({ ...values }))
  //   .then((json) => json)
  //   .catch((e) => e);
  return {};
};

export const loadUser = (id) => {
  return fetchRequest(`${URL}/${id}`)
    .then((json) => json)
    .catch((e) => e);
};

export const createUser = (values) => {
  return fetchRequest(URL, { method: "post", body: values })
    .then((json) => json)
    .catch((e) => e);
};

export const updateUser = ({ id, values }) => {
  return fetchRequest(`${URL}/` + id, {
    method: "put",
    body: values,
  })
    .then((json) => json)
    .catch((e) => e);
};

export const deleteUser = ({ idArray, isAll }) => {
  return fetchRequest(`${URL}?${groupDelete(idArray, isAll)}`, {
    method: "delete",
  })
    .then((json) => json)
    .catch((e) => e);
};

export const loadParticipantUsers = ({ values, participantId }) => {
  return fetchRequest(`${URL}/participant/${participantId}?` + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};

export const updateUserProfile = (values) => {
  return fetchRequest("/api/v1/profile", {
    method: "put",
    body: values,
  })
    .then((json) => json)
    .catch((e) => e);
};
