import { fetchRequest } from "helpers/fetchRequest";

export const URL = "/api/v1/catalogs/group_control_safety";

export const loadGroupControlSafety = (values) => {
  return fetchRequest(`${URL}?` + new URLSearchParams({ ...values }))
    .then((json) => json)
    .catch((e) => e);
};

export const loadGroupControlSafetyEntity = (id) => {
  return fetchRequest(`${URL}/${id}`)
    .then((json) => json)
    .catch((e) => e);
};
export const getIntegrationInfoGroupControlSafety = () => {
  return fetchRequest(`${URL}/integration/show`)
    .then((json) => json)
    .catch((e) => e);
};

export const setIntegrationScheduleGroupControlSafety = (cronCommand) => {
  return fetchRequest(`${URL}/integration/change`, {
    method: "post",
    body: {
      time: cronCommand,
    },
  })
    .then((json) => json)
    .catch((e) => e);
};

export const changeIntegrationGroupControlSafety = (command) => {
  return fetchRequest(`${URL}/integration/${command}`, {
    method: "post",
  })
    .then((json) => json)
    .catch((e) => e);
};
