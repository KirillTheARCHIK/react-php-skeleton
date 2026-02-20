import { store } from "store/store";
import { momentDate } from "./date";
import { INITIAL_VALUES_STATE_PAGE } from "constants/request";

export const getFilterParams = (values, filters = []) => {
  const params = {};
  const strictKeys = getStrictKeysForColumns(filters);
  Object.keys(values).forEach((key) => {
    if (typeof values[key] === "object" && values[key] !== null) {
      if (values[key]["start"] || values[key]["end"]) {
        Object.keys(values[key]).forEach((item) => {
          params[`where[${key}][${item}]`] = values[key][item];
        });
      } else if (values[key]["filterName"]) {
        params[`where[${values[key]["filterName"]}]`] = values[key].id;
      } else if (strictKeys.includes(key)) {
        params[`where[${key}]`] = values[key].id;
      } else {
        params[`where[${key}Id]`] = values[key].id;
      }
    } else {
      params[`where[${key}]`] = values[key];
    }
  });

  return params;
};

export const getDownloadReportParams = (values) => {
  const params = {};
  Object.keys(values).forEach((key) => {
    if (key === "monthyear") {
      params[`where[${key}]`] = momentDate(values[key]).format("MM-YYYY");
    } else if (key === "year") {
      params[`where[${key}]`] = momentDate(values[key]).format("YYYY");
    } else if (typeof values[key] === "object") {
      params[`where[${key}]`] = values[key].id;
    } else {
      params[`where[${key}]`] = values[key];
    }
  });

  return params;
};

export const getBuildReportParams = (values) => {
  const params = {};
  Object.keys(values).forEach((key) => {
    const startDateKey = "where[exitLineTime][start]";
    const endDateKey = "where[exitLineTime][end]";
    if (key === "monthyear") {
      params[startDateKey] = momentDate(values[key]).format("YYYY-MM-01");
      params[endDateKey] = momentDate(values[key]).format("YYYY-MM-31");
    } else if (key === "year") {
      params[startDateKey] = momentDate(values[key]).format("YYYY-01-01");
      params[endDateKey] = momentDate(values[key]).format("YYYY-12-31");
    } else if (typeof values[key] === "object") {
      params[`where[${key}]`] = values[key].id;
    } else {
      params[`where[${key}]`] = values[key];
    }
  });

  return params;
};

export const getRequestValues = (values) => {
  const params = {};
  Object.entries(values).forEach(([key, value]) => {
    if (typeof value === "object" && value?.id !== undefined) {
      params[key] = value.id;
    } else params[key] = value;
  });
  return params;
};

export const getParamsApi = (requestParams = {}, filters) => {
  const { paginationParams, filterParams, sortParams, searchParams } = requestParams;
  const filter = getFilterParams(filterParams, filters);

  const params = {
    ...paginationParams,
    ...sortParams,
    ...searchParams,
    ...filter,
  };
  return params;
};

export const loadDataWithRequestParams = (loadData, requestParams, initialRequestParams = INITIAL_VALUES_STATE_PAGE, id) => {
  if (requestParams) {
    return loadData(getParamsApi(requestParams), id);
  }
  return loadData(initialRequestParams, id);
};

export const getInitialValuesStatePage = () => {
  const user = store.getState().currentUser;
  const userSettings = store.getState().userSettings;

  const matchingEntries = userSettings.entries.filter((entry) => entry.user.id === user.id && entry.name === "numberRowsTable");

  if (matchingEntries.length !== 0) {
    return { ...INITIAL_VALUES_STATE_PAGE, limit: matchingEntries[0].value };
  }

  return INITIAL_VALUES_STATE_PAGE;
};

export const getStrictKeysForColumns = (columns = []) => {
  return columns.filter((column) => column.field?.type === "select").map((column) => column.id);
};
