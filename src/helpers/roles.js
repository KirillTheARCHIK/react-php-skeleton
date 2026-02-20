import { NOT_VISIBLE_ROLES } from "constants/roles";

export const renderParameterByRole = (
  parameter,
  routeRoles = [],
  actionKey
) => {
  if (routeRoles.some((item) => item.includes(actionKey))) {
    return parameter;
  }
  return null;
};

export const getStartPages = (userRoles) => {
  const filterRoles = userRoles.filter(
    (el) => !NOT_VISIBLE_ROLES.includes(el.key)
  );

  return filterRoles.map((item) => ({
    ...item,
    id: item.key,
    label: item.name,
  }));
};
