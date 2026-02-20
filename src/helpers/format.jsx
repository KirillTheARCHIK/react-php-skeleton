import React from "react";
import { store } from "store/store";
import { Box, Rating } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import { colord } from "colord";
import Icon from "components/Icon";

import { MODAL_STATE } from "components/Modal";
import { momentFormatTime } from "./date";

import { ROLE_NAMING } from "constants/userTypes";
import { modalSlice } from "store/utility/modalSlice";

export const getAsyncSelectValue = (value) => {
  return value?.displayName ?? value?.name ?? null;
};

export const formatTextButton = ({ value, onClick = () => {} }) => {
  return (
    <a
      href="#"
      style={{
        textDecoration: "underline",
      }}
      onClick={onClick}
    >
      {value}
    </a>
  );
};

export const formatHyperLink = ({ value, url }) => {
  return <Link to={url}>{value}</Link>;
};

export const formatOpenModal = ({ value, modalState = MODAL_STATE.OPENED, modalName, modalData }) => {
  return formatTextButton({
    value,
    onClick: () => {
      store.dispatch(modalSlice.actions.openModal({ modalName, modalState, data: modalData }));
    },
  });
};

export const getDelayColor = (value) => {
  return (
    <Box
      component="div"
      sx={{
        color: value > 0 ? "red" : "green",
      }}
    >
      {momentFormatTime(Math.abs(value), true)}
    </Box>
  );
};

export const getColorIcon = ({ color, name }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: "2vh",
          height: "2vh",
          borderRadius: "50%",
          flexShrink: 0,
          backgroundColor: color,
        }}
      />

      {name && <Box component="span">{name}</Box>}
    </Box>
  );
};

export const getTooltip = ({ title, children }) => {
  return (
    <Tooltip title={title} placement="bottom">
      <span>{children}</span>
    </Tooltip>
  );
};

export const getStatusColor = ({ name, slug, color, params }) => {
  if (typeof slug === "string") {
    return (
      <Box component="div" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Icon name="circle" color={color ?? params[slug]?.color} />
        <Box component="span">{name ?? params[slug]?.label}</Box>
      </Box>
    );
  }
  return null;
};

export const getModalTitle = (title, isView = false, isEdit = false, createString = "Создать", editString = "Редактировать") => {
  if (typeof title !== "string" || title.length === 0) {
    throw Error("Необходимо передать непустую строку");
  }
  if (isView) {
    return `${title[0].toUpperCase()}${title.slice(1)}`;
  }
  if (isEdit) {
    return `${editString} ${title}`;
  }
  return `${createString} ${title}`;
};

export const getColoredCalendarShiftName = (value, expired) => {
  return (
    <Box component="div" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Icon name="circle" color={expired ? "error" : "success"} />
      <Box component="span">{value}</Box>
    </Box>
  );
};

export const getDisplayName = (value) => {
  if (typeof value === "object") {
    return value?.displayName ?? null;
  }
  return value;
};

export const getUserRole = (value) => {
  return value.map((role) => ROLE_NAMING[role] ?? role).join(", ");
};

export const getBooleanValue = (value) => {
  if (value !== undefined) {
    if (value) {
      return "Да";
    }
    return "Нет";
  }
  return value;
};

export const getBooleanVehicleInOrder = (value) => {
  if (value === null) {
    return "Не известно";
  }
  if (value) {
    return "Да";
  }
  return "Нет";
};

export const getDisplayNamesExecutors = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => item.driver.displayName).join(", ");
  }
  return value;
};

export const getDisplayNamesFormArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => item.displayName).join(", ");
  }
  return value;
};

export const getLicenseCategories = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => item.displayName).join(", ");
  }
  return value;
};

export const getStatusMessageTemplate = (value) => {
  return value ? "Активный" : "Не активный";
};

export const getValueNumber = (value) =>
  value !== undefined && value !== null && !isNaN(value) && typeof value === "number" ? toSecond(+value).toLocaleString("ru") : "";
export const toSecond = (value) => Math.round(value * 100) / 100;

export function formatFileSize(size) {
  let newSize = size / 1e9;
  if (newSize > 1) return newSize.toFixed(2) + " Гбайт";
  newSize = size / 1e6;
  if (newSize > 1) return newSize.toFixed(2) + " Мбайт";
  newSize = size / 1e3;
  if (newSize > 1) return newSize.toFixed(2) + " Кбайт";
  return size + " Б";
}

export const formatTwoDecimalPlaces = (value) => {
  if (typeof value === "number") {
    return String(value).replace(/(\.\d{2})\d+/g, "$1");
  }
  return value;
};

export const formatOnlyNumber = (value) => {
  if (typeof value === "number") {
    return String(value).replace(/[^0-9]/g, "");
  }
  return "";
};

export const getObjectValue = (value) => {
  return value?.value;
};

export const getRepairPost = (value) => {
  if (value === null) return 0;
  return value;
};

export const highlightValue = (value, color = "primary.main") => {
  return (
    <Box
      component="span"
      sx={{
        color: color,
        fontWeight: 700,
      }}
    >
      {value ?? "Нет данных"}
    </Box>
  );
};

export const getColorRgb = (value) => {
  return colord(value).toRgbString();
};

export const getColorHex = (value) => {
  return colord(value).toHex();
};

export const getColorRgbWithTransparency = (value, number) => {
  const dividedNum = parseFloat(number) / 100;

  return colord(getColorHex(value)).alpha(+dividedNum).toRgbString();
};

export const formatRating = (value = {}) => {
  if (value.star) {
    return (
      <Rating
        name="rating"
        value={value.star}
        readOnly
        sx={{
          "& .MuiRating-iconFilled": {
            color: (theme) => theme.palette.primary.main,
          },
        }}
      />
    );
  }
  return null;
};

export const getBooleanUser = (value) => {
  return value ? "Включен" : "Отключен";
};

/**
 * Вычисляет форму склонения для дополнения.

 * @param {number} number числительное в цифровом виде, к которому будет
 * вычисляться форма склонения
 * @param {string} one Отвечает за вариант склонение дополнения для
 * единственного числа (**1 яблоко**)
 * @param {string} two  Отвечает за склонение в диапазоне [2; 4] (**2
 * яблока**)
 * @param {string} five Для диапазона [5; 9] и 0 (**0 яблок** или **9 яблок**)
 * @return {string} Возвращает правильную форму, например:
 * **яблоко**, **яблока** или **яблок**
 */

export const getDeclensionWord = (number, one, two, five) => {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
};
