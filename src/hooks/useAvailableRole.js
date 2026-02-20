import { useSelector } from "react-redux";

/**
 * Тип роли пользователя для заданного маршрута
 *
 * @typedef {Object} UserRole
 * @property {string} name название маршрута
 * @property {string} key ключ маршрута
 * @property {string} controller название контроллера
 * @property {string[]} roles список ролей пользователя для данного маршрута
 */

/**
 * Определяет авторизован ли пользователь для выполнения указанной операции в
 * рамках заданного маршрута
 *
 * @param {string} routeId ключ маршрута
 * @param {string} actionKey ключ действия
 * @return {boolean}
 */
export const useAvailableRole = (routeId, actionKey) => {
  /**
   * Список ролей пользователя для всех маршрутов
   * @type {UserRole[]}
   */
  const userRoles = useSelector((state) => state.auth.roles);

  /**
   * Список основных ролей пользователя, таких как ["USER_ROLE", "ADMIN_ROLE"]
   * @type {string[]}
   */
  const mainRoles = useSelector((state) => state.auth.currentUser.roles);

  const userRole = userRoles.find((role) => role.key === routeId);
  if (userRole) {
    return userRole.roles.some((role) => role.includes(actionKey)) || userRole.roles.every((role) => mainRoles.includes(role));
  }
  return false;
};
