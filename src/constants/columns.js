import { formatFullDateTime, secondsToFormattedDate } from "helpers/date";
import { getBooleanUser, getBooleanValue, getDisplayName, getObjectValue, getStatusColor, getTooltip } from "helpers/format";
import { required } from "helpers/formValidators";

import { loadUsers } from "services/catalogs/users";

import { STATUS_SECRYPTION_STAGE } from "./status";
import { USER_EVENTS_TYPE } from "constants/typesEvents";

export const USER_EVENTS_COLUMNS = [
  {
    id: "created",
    label: "Дата и время",
    format: formatFullDateTime,
    field: {
      type: "datetime",
    },
  },
  {
    id: "type",
    label: "Тип события",
    format: getObjectValue,
    field: {
      format: getObjectValue,
      type: "select",
      options: Object.values(USER_EVENTS_TYPE),
    },
  },
  {
    id: "entityName",
    label: "Объект",
    format: getObjectValue,
    field: {
      format: getObjectValue,
    },
  },
  { id: "description", label: "Описание" },
  { id: "username", label: "Пользователь" },
  {
    id: "user",
    label: "ФИО",
    format: getDisplayName,
    field: {
      type: "asyncselect",
      loadOptions: loadUsers,
    },
  },
];

export const USERS_COLUMNS = [
  {
    id: "login",
    label: "Имя пользователя",
  },
  { id: "patronymic", label: "Фамилия" },
  { id: "name", label: "Имя" },
  { id: "lastName", label: "Отчество" },
  { id: "email", label: "Служебный Email" },
  { id: "phoneNumber", label: "Рабочий телефон" },
  {
    id: "enabled",
    label: "Статус Пользователя",
    format: getBooleanUser,
    field: {
      type: "select",
      options: [
        { label: "Включен", id: true },
        { label: "Отключен", id: false },
      ],
    },
  },
];

export const REQUEST_STATUSES_COLUMNS = [
  { id: "name", label: "Наименование" },
  {
    id: "updatedAt",
    label: "Дата обновления",
    format: formatFullDateTime,
    field: {
      type: "date",
    },
  },
];

export const WAYPOINT_STATUSES_COLUMNS = [
  { id: "name", label: "Наименование" },
  {
    id: "updatedAt",
    label: "Дата обновления",
    format: formatFullDateTime,
    field: {
      type: "date",
    },
  },
];

export const WAYPOINT_TYPES_COLUMNS = [
  { id: "name", label: "Наименование" },
  {
    id: "updatedAt",
    label: "Дата обновления",
    format: formatFullDateTime,
    field: {
      type: "date",
    },
  },
];

export const VEHICLE_PROFILES_COLUMNS = [
  { id: "name", label: "Наименование", field: { validate: required } },
  { id: "description", label: "Описание", field: { validate: required } },
  {
    id: "uniq",
    label: "Уникальность",
    format: getBooleanValue,
    field: {
      type: "checkBox",
      format: getBooleanValue,
    },
  },
  { id: "author", label: "Автор", format: getDisplayName },
  { id: "editor", label: "Редактор", format: getDisplayName },
  {
    id: "createdAt",
    label: "Дата создания",
    format: formatFullDateTime,
    field: {
      type: "date",
    },
  },
  {
    id: "updatedAt",
    label: "Дата обновления",
    format: formatFullDateTime,
    field: {
      type: "date",
    },
  },
];

export const CURRENT_EVENTS_COLUMNS = [
  {
    id: "name",
    label: "Наименование",
  },
  {
    id: "startedAt",
    label: "Дата и время начала дешифрирования",
    format: secondsToFormattedDate,
    field: {
      type: "date",
    },
  },
  {
    id: "endAt",
    label: "Дата и время окончания дешифрирования",
    format: formatFullDateTime,
    field: {
      type: "date",
    },
  },
  {
    id: "status",
    label: "Стадия дешифрирования",

    tooltipFormat: (values) => {
      return getTooltip({
        title: values?.status?.message,
        children: getStatusColor({
          slug: values?.status?.status,
          params: STATUS_SECRYPTION_STAGE,
        }),
      });
    },
  },
];
