import { fetchRequest } from "helpers/fetchRequest";
import { getJsonContent } from "helpers/webdav";

const URL = "/api/v1/catalogs/decryptions";

const URL_DECRYPTION = "/api/decrypt/station";

export function getDecryptions() {
  // return fetchRequest(
  //   `${URL}?` +
  //     new URLSearchParams({
  //       sort: "asc",
  //       column: "id",
  //       ...values,
  //     })
  // )
  //   .then((json) => json)
  //   .catch((e) => e);
  return getJsonContent("/decryptions.json");
}

export function getDecryption({ id }) {
  return fetchRequest(`${URL}/` + id)
    .then((json) => json)
    .catch((e) => e);
}

export function getTest(id) {
  return fetchRequest(`${URL_DECRYPTION}/` + id)
    .then((json) => json)
    .catch((e) => e);
}

export function updateDecryption({ id, values }) {
  return fetchRequest(`${URL}/` + id, {
    method: "patch",
    body: values,
  })
    .then((json) => json)
    .catch((e) => e);
}
