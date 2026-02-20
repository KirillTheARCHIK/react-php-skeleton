import { ROUTES, type PageRoute } from "constants/routes";

export interface UserRoleDTO {
  name: string;
  key: string;
  controller: string;
  roles: string[];
}

export const buildRoutes = (userRoles: UserRoleDTO[]) => {
  const roles = ROUTES.map((item) => ({
    id: item.id,
    name: item.name,
    children: item.routes.reduce((acc: (UserRoleDTO & PageRoute)[], current) => {
      const role = userRoles.find((role) => role.key === current.routeId);
      if (role) {
        acc.push({
          ...role,
          ...current,
        });
      }
      return acc;
    }, []),
  }));

  return roles.filter((el) => Boolean(el.children.length));
};
