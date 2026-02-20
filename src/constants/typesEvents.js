export const LOGIN = "login";
export const LOGOUT = "logout";
export const UPDATE = "update";
export const DELETE = "remove";
export const CREATE = "create";

export const USER_EVENTS_TYPE = {
  [LOGIN]: {
    label: "Выполнен вход в систему",
    id: LOGIN,
  },
  [LOGOUT]: {
    label: "Выполнен выход из системы",
    id: LOGOUT,
  },
  [UPDATE]: {
    label: "Обновление",
    id: UPDATE,
  },
  [DELETE]: {
    label: "Удаление",
    id: DELETE,
  },
  [CREATE]: {
    label: "Создание",
    id: CREATE,
  },
};
