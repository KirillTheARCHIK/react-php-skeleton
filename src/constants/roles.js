export const ROLE_VIEW = "VIEW";
export const ROLE_CREATE = "CREATE";
export const ROLE_EDIT = "EDIT";
export const ROLE_DELETE = "DELETE";
export const ROLE_EXPORT = "EXPORT";
export const ROLE_INTEGRATION = "INTEGRATION";
export const ROLE_APPROVE = "APPROVE";
export const ROLE_CANCEL = "CANCEL";
export const ROLE_REJECT = "REJECT";
export const ROLE_DECLINE = "DECLINE";
export const ROLE_DISTRIBUTE = "DISTRIBUTE";
export const ROLE_BLOCK = "BLOCK";
export const ROLE_CLOSE = "CLOSE";

export const ROLE_TT_VEHICLE_RELEASE_APPROVE =
  "ROLE_TT_VEHICLE_RELEASE_APPROVE";

export const ROLE_ACTIONS = {
  [ROLE_VIEW]: {
    key: ROLE_VIEW,
    name: "view",
    title: "Просмотр",
  },
  [ROLE_CREATE]: {
    key: ROLE_CREATE,
    name: "add",
    title: "Создание",
  },
  [ROLE_EDIT]: {
    key: ROLE_EDIT,
    name: "edit",
    title: "Редактирование",
  },
  [ROLE_DELETE]: {
    key: ROLE_DELETE,
    name: "delete",
    title: "Удаление",
  },
  [ROLE_EXPORT]: {
    key: ROLE_EXPORT,
    name: "export",
    title: "Экспорт",
  },
  [ROLE_INTEGRATION]: {
    key: ROLE_INTEGRATION,
    name: "schedule",
    title: "Интеграция",
  },
  [ROLE_APPROVE]: {
    key: ROLE_APPROVE,
    name: "approve",
    title: "Утверждение",
  },
  [ROLE_CANCEL]: {
    key: ROLE_CANCEL,
    name: "cancel",
    title: "Аннулирование",
  },
  [ROLE_REJECT]: {
    key: ROLE_REJECT,
    name: "reject",
    title: "Отклонение",
  },
  [ROLE_DISTRIBUTE]: {
    key: ROLE_DISTRIBUTE,
    name: "distribute",
    title: "Распределение",
  },
  [ROLE_BLOCK]: {
    key: ROLE_BLOCK,
    name: "reject",
    title: "Заблокировать/Разблокировать",
  },

  [ROLE_CLOSE]: {
    key: ROLE_CLOSE,
    name: "close",
    title: "закрыть",
  },
};

export const NOT_VISIBLE_ROLES = [
  "message_template_group",
  "file",
  "user_task",
  "filter_template",
];
