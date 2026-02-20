export interface PageRouteTab {
  id: string;
  name: string;
  routes: PageRoute[];
}

export interface PageRoute {
  routeId: string;
  groupId: string;
  visible?: boolean;
}

export const VEHICLES = "vehicles";
export const STAFF = "staff";
export const NOTIFICATIONS = "notifications";
export const LOGS = "logs";
export const ADMINISTRATION = "administration";
export const ORGANIZATIONS = "organizations";
export const REPAIR = "repair";
export const MONITORING = "monitoring";
export const WORK_PASSPORT = "work_passport";
export const LOGISTICS = "logistics";
export const ELECTRONIC_WAYBILL = "waybills";
export const OWN_VEHICLES = "own_vehicles";
export const MANAGEMENT_CONTRACTORS = "management_contractors";
export const REFERENCES = "references";
export const VEHICLES_CONTRACTING_ORGANIZATIONS = "vehicles_contracting_organizations";
export const VEHICLE_MONITIRONG = "vehicle_monitoring";
export const MMK_STAFF = "mmk_staff";
export const REGISTRY_SUBJECTS = "registry_subjects";
export const REGISTRIES = "registries";
export const JOBS = "jobs";
export const USER_MANAGEMENT = "user_management";
export const USER = "user";
export const ADMINISTRATOR_FUNCTIONS = "administrator_functions";
export const CONTRACTOR_PERSONNEL = "contractor_personnel";
export const REPORTS = "reports";
export const VEHICLE_VIOLATIONS = "vehicle_violations";
export const PERFORMANCE_INDICATORS = "performance_indicators";
export const SYSTEM_DIRECTORIES = "system_directories";

export const ROUTES: PageRouteTab[] = [
  {
    id: WORK_PASSPORT,
    name: "Паспорт работ",
    routes: [
      { routeId: "flightAssignment", groupId: OWN_VEHICLES },
      { routeId: "decryption", groupId: OWN_VEHICLES },
      { routeId: "verification", groupId: OWN_VEHICLES },
    ],
  },
  {
    id: STAFF,
    name: "Справочники",

    routes: [{ routeId: "driver", groupId: MMK_STAFF }],
  },
  {
    id: ORGANIZATIONS,
    name: "Отчеты",

    routes: [
      { routeId: "contractor", groupId: MANAGEMENT_CONTRACTORS },
      // { routeId: "contract", groupId: MANAGEMENT_CONTRACTORS },
    ],
  },
  {
    id: ADMINISTRATION,
    name: "Администрирование",

    routes: [
      { routeId: "user", groupId: USER_MANAGEMENT },
      // { routeId: "user_setting", groupId: USER_MANAGEMENT },
      // { routeId: "user_group", groupId: USER_MANAGEMENT },
      { routeId: "user_event", groupId: USER_MANAGEMENT },
      // { routeId: "message_template", groupId: ADMINISTRATOR_FUNCTIONS },
      { routeId: "user_task", groupId: USER },
    ],
  },
];
