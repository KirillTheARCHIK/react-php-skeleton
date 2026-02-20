import {
  MONITORING,
  WORK_PASSPORT,
  STAFF,
  ORGANIZATIONS,
  OWN_VEHICLES,
  VEHICLES_CONTRACTING_ORGANIZATIONS,
  MMK_STAFF,
  JOBS,
  REGISTRY_SUBJECTS,
  USER_MANAGEMENT,
  VEHICLE_MONITIRONG,
  ADMINISTRATOR_FUNCTIONS,
  REGISTRIES,
  MANAGEMENT_CONTRACTORS,
  REFERENCES,
  ADMINISTRATION,
  REPAIR,
  LOGISTICS,
  USER,
  CONTRACTOR_PERSONNEL,
  SYSTEM_DIRECTORIES,
  REPORTS,
  ELECTRONIC_WAYBILL,
} from "constants/routes";

export const buildMenu = (userRoles, location) => {
  const menuStructure = userRoles.map((item) => {
    switch (item.id) {
      case WORK_PASSPORT:
        return {
          id: item.id,
          name: item.name,
          childs: [
            {
              id: OWN_VEHICLES,
              icon: {
                name: "",
              },
              childs: filterChildrenByGroupId(item, OWN_VEHICLES, location),
            },
            {
              id: VEHICLES_CONTRACTING_ORGANIZATIONS,
              name: "Транспортные средства подрядных организаций",
              icon: {
                name: "vehiclesContractors",
              },
              childs: filterChildrenByGroupId(item, VEHICLES_CONTRACTING_ORGANIZATIONS, location),
            },
            {
              id: VEHICLE_MONITIRONG,
              name: "Мониторинг",
              icon: {
                name: "vehicleMonitoring",
              },
              childs: filterChildrenByGroupId(item, VEHICLE_MONITIRONG, location),
            },
          ],
        };
      case STAFF:
        return {
          id: item.id,
          name: item.name,
          childs: [
            {
              id: MMK_STAFF,
              name: "Наименование раздела",
              icon: {
                name: "contractorPersonnel",
              },
              childs: filterChildrenByGroupId(item, MMK_STAFF, location),
            },
            {
              id: CONTRACTOR_PERSONNEL,
              name: "Подрядные организации",
              icon: {
                name: "contractorPersonnel",
              },
              childs: filterChildrenByGroupId(item, CONTRACTOR_PERSONNEL, location),
            },
            {
              id: REFERENCES,
              name: "Справочники",
              icon: {
                name: "violationsVehicle",
              },
              childs: filterChildrenByGroupId(item, REFERENCES, location),
            },
            {
              id: REPORTS,
              name: "Отчеты",
              icon: {
                name: "ratingPerformanceIndicators",
              },
              childs: filterChildrenByGroupId(item, REPORTS, location),
            },
          ],
        };
      case ORGANIZATIONS:
        return {
          id: item.id,
          name: item.name,
          childs: [
            {
              id: MANAGEMENT_CONTRACTORS,
              name: "Наименование раздела",
              icon: {
                name: "managementContractors",
              },
              childs: filterChildrenByGroupId(item, MANAGEMENT_CONTRACTORS, location),
            },
          ],
        };

      case ADMINISTRATION:
        return {
          id: item.id,
          name: item.name,
          childs: [
            {
              id: USER_MANAGEMENT,
              name: "Наименование раздела",
              icon: {
                name: "userManagement",
              },
              childs: filterChildrenByGroupId(item, USER_MANAGEMENT, location),
            },
            {
              id: ADMINISTRATOR_FUNCTIONS,
              name: "Функции администратора",
              icon: {
                name: "administratorFunctions",
              },
              childs: filterChildrenByGroupId(item, ADMINISTRATOR_FUNCTIONS, location),
            },
            {
              id: USER,
              name: "Пользователь",
              icon: {
                name: "user",
              },
              childs: filterChildrenByGroupId(item, USER, location),
            },
            {
              id: SYSTEM_DIRECTORIES,
              name: "Системные справочники",
              icon: {
                name: "systemDirectories",
              },
              childs: filterChildrenByGroupId(item, SYSTEM_DIRECTORIES, location),
            },
          ],
        };
      case REPAIR:
        return {
          id: item.id,
          name: item.name,
          childs: [
            {
              id: JOBS,
              name: "Рабочие места",
              icon: {
                name: "jobs",
              },
              childs: filterChildrenByGroupId(item, JOBS, location),
            },
            {
              id: REFERENCES,
              name: "Справочники",
              icon: {
                name: "referencesRepair",
              },
              childs: filterChildrenByGroupId(item, REFERENCES, location),
            },
          ],
        };
      case ELECTRONIC_WAYBILL:
        return {
          id: item.id,
          name: item.name,
          childs: [
            {
              id: REFERENCES,
              name: "Справочники",
              icon: {
                name: "logistic",
              },
              childs: filterChildrenByGroupId(item, REFERENCES, location),
            },
          ],
        };
      case LOGISTICS:
        return {
          id: item.id,
          name: item.name,
          childs: [
            {
              id: REFERENCES,
              name: "Справочники",
              icon: {
                name: "logistic",
              },
              childs: filterChildrenByGroupId(item, REFERENCES, location),
            },
            {
              id: REGISTRY_SUBJECTS,
              name: "Субъекты реестров",
              icon: {
                name: "registerEntities",
              },
              childs: filterChildrenByGroupId(item, REGISTRY_SUBJECTS, location),
            },
            {
              id: REGISTRIES,
              name: "Реестры",
              icon: {
                name: "registries",
              },
              childs: filterChildrenByGroupId(item, REGISTRIES, location),
            },
            {
              id: MONITORING,
              name: "Мониторинг",
              icon: {
                name: "vehicleMonitoring",
              },
              childs: filterChildrenByGroupId(item, MONITORING, location),
            },
          ],
        };
      default:
        return item;
    }
  });

  return menuStructure.map((item) => ({
    ...item,
    childs: item?.childs?.filter((el) => Boolean(el.childs.length)),
  }));
};

const filterChildrenByGroupId = (item, groupId, location) => {
  const filterChildren = item.children.filter((el) => el.groupId === groupId);
  if (location === "menu") {
    return filterChildren.filter((element) => element.visible !== false);
  }
  return filterChildren;
};
