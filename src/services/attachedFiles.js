import { fetchRequest } from "helpers/fetchRequest";

export const ENTITIES = {
  ACCIDENTS: "accidents",
  VIOLATIONS: "traffic_violations",
  CONTRACTOR_VEHICLES: "vehicles",
  CONTRACTOR_DRIVERS: "drivers",
  NOTES: "notes",
};

const ROUTE_PATH = {
  accidents: "catalogs",
  traffic_violations: "catalogs",
  vehicles: "catalogs/contractor",
  drivers: "catalogs/contractor",
  notes: "",
};

const URL = "/api/v1";

export function getAttachedFiles({ entities, id }) {
  return fetchRequest(`${URL}/${ROUTE_PATH[entities]}/${entities}/files/${id}`)
    .then((json) => json)
    .catch((e) => e);
}

export function createAttachedFile({ entities, id, values }) {
  return fetchRequest(`${URL}/${ROUTE_PATH[entities]}/${entities}/files/${id}`, {
    method: "post",
    body: values,
  })
    .then((json) => json)
    .catch((e) => e);
}

export function deleteAttachedFile({ entities, id }) {
  return fetchRequest(`${URL}/${ROUTE_PATH[entities]}/${entities}/files/${id}`, {
    method: "delete",
  })
    .then((json) => json)
    .catch((e) => e);
}

export function updateAttachedFile({ id, entities, values }) {
  return fetchRequest(`${URL}/${ROUTE_PATH[entities]}/${entities}/files/${id}`, {
    method: "put",
    body: values,
  })
    .then((json) => json)
    .catch((e) => e);
}
