// Механик
export const ROLE_MECHANIC = "ROLE_MECHANIC";
// Диспетчер
export const ROLE_DISPATCHER = "ROLE_DISPATCHER";
// Диспетчер по направлению
export const ROLE_DIRECTION_DISPATCHER = "ROLE_DIRECTION_DISPATCHER";
// Старший диспетчер
export const ROLE_SENIOR_DISPATCHER = "ROLE_SENIOR_DISPATCHER";
// Инженер по работе с подрядчиками
export const ROLE_CONTRACTOR_ENGINEER = "ROLE_CONTRACTOR_ENGINEER";
// Контроллер
export const ROLE_INSPECTOR = "ROLE_INSPECTOR";
// Заказчик
export const ROLE_CUSTOMER = "ROLE_CUSTOMER";
// Водитель
export const ROLE_MOBILE = "ROLE_MOBILE";
// Агент поддержки
export const ROLE_SUPPORT = "ROLE_SUPPORT";
// Администратор
export const ROLE_ADMIN = "ROLE_ADMIN";
export const ROLE_CONTRACTOR = "ROLE_CONTRACTOR";
export const ROLE_LEAD = "ROLE_LEAD";
export const ROLE_MASTER = "ROLE_MASTER";

// Переводы
export const ROLE_NAMING = {
  [ROLE_MECHANIC]: "Механик",
  [ROLE_DISPATCHER]: "Диспетчер",
  [ROLE_DIRECTION_DISPATCHER]: "Диспетчер по направлению",
  [ROLE_SENIOR_DISPATCHER]: "Старший диспетчер",
  [ROLE_CONTRACTOR_ENGINEER]: "Инженер по работе с подрядчиками",
  [ROLE_INSPECTOR]: "Контролер",
  [ROLE_CUSTOMER]: "Заказчик",
  [ROLE_MOBILE]: "Водитель",
  [ROLE_SUPPORT]: "Агент поддержки",
  [ROLE_ADMIN]: "Администратор УЭ",
  [ROLE_CONTRACTOR]: "Подрядчик",
  [ROLE_LEAD]: "Руководитель",
  [ROLE_MASTER]: "Мастер",
};

export const ROLE_OPTIONS = Object.entries(ROLE_NAMING).map(([id, label]) => ({
  id,
  label,
}));
