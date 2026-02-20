import CustomShowMoreText from "components/ShowMoreText/CustomShowMoreText";
import {
  DEFAULT_MIN_WIDTH_CELL,
  DEFAULT_MAX_WIDTH_CELL,
} from "constants/table";

export const getAllCheckboxes = (checkedEntries) => {
  let allCheckboxes = [];
  Object.keys(checkedEntries).forEach((key) => {
    allCheckboxes = [...allCheckboxes, ...(checkedEntries?.[key] || [])];
  });
  const newSet = new Set(allCheckboxes);
  return Array.from(newSet);
};

export const setCursorDocument = (isResizing) => {
  document.body.style.cursor = isResizing ? "col-resize" : "auto";
};

export const adjustWidthColumn = (
  index,
  width,
  resizeLineElement,
  columns,
  setColumnsInfo,
  routeId
) => {
  const minWidth = columns[index]?.minWidth ?? DEFAULT_MIN_WIDTH_CELL;
  const maxWidth = resizeLineElement?.maxWidth ?? DEFAULT_MAX_WIDTH_CELL;
  let newWidth = null;
  if (width > maxWidth) {
    newWidth = maxWidth;
  } else if (width < minWidth) {
    newWidth = minWidth;
  } else {
    newWidth = width;
  }
  resizeLineElement.parentElement.style.width = newWidth + "px";
  const columnsInfo = {};
  columns.forEach((item, index) => {
    columnsInfo[item.id] = {};
    const resizeLineElement = document.getElementById(
      `${routeId}_resizeLine_${index}`
    );

    columnsInfo[item.id] =
      resizeLineElement.parentElement.style.width || "160px";
  });
  setColumnsInfo(columnsInfo);
};

export function loadColumnInfoLocalStorage(routeId, setColumnsInfo, columns) {
  const allColumnsResizeTable = JSON.parse(
    localStorage.getItem("columnsResizeTable")
  );

  const columnsResizeTable = allColumnsResizeTable?.[routeId];

  columns.forEach((item, index) => {
    const resizeLineElements = document.querySelectorAll(
      `#${routeId}_resizeLine_${index}`
    );
    resizeLineElements.forEach((resizeLineElement) => {
      resizeLineElement.parentElement.style.width =
        columnsResizeTable?.[item.id] || "160px";
    });
  });
  setColumnsInfo(columnsResizeTable);
}

export const saveColumnInfoLocalStorage = (columns, routeId) => {
  const columnsResizeTable = JSON.parse(
    localStorage.getItem("columnsResizeTable")
  );
  const columnsInfo = {};
  columns.forEach((item, index) => {
    columnsInfo[item.id] = {};
    const resizeLineElement = document.getElementById(
      `${routeId}_resizeLine_${index}`
    );

    columnsInfo[item.id] =
      resizeLineElement.parentElement.style.width || "160px";
  });

  localStorage.setItem(
    "columnsResizeTable",
    JSON.stringify({
      ...columnsResizeTable,
      [routeId]: columnsInfo,
    })
  );
};
export const handleOnMouseMove = (
  e,
  isResizing,
  columns,
  setColumnsInfo,
  routeId
) => {
  if (isResizing.current >= 0) {
    const resizeLineElement = document.getElementById(
      `${routeId}_resizeLine_${isResizing.current}`
    );
    const left = resizeLineElement.parentElement?.getBoundingClientRect().left;

    const newWidth = e.clientX - left;

    adjustWidthColumn(
      isResizing.current,
      newWidth,
      resizeLineElement,
      columns,
      setColumnsInfo,
      routeId
    );
  }
};
export const onClickResizeColumn = (index, isResizing) => {
  isResizing.current = index;
  setCursorDocument(true);
};

export const handleOnMouseUp = (isResizing, columns, routeId) => {
  isResizing.current = -1;
  saveColumnInfoLocalStorage(columns, routeId);
  setCursorDocument(false);
};
export const getWidthColumn = (widthColumn) => {
  return typeof widthColumn === "string" ? widthColumn.replace("px", " ") : 160;
};

export const getColumnValue = ({
  column,
  value,
  widthColumn,
  row,
  searchParams = {},
  renderHighlightedText,
  isShowMoreText,
  expandedText,
}) => {
  const columnValue = column?.format ? column.format(value, row) : value;
  if (Object.keys(searchParams).length) {
    return column.format
      ? column.format(value, row)
      : renderHighlightedText(value, searchParams.search);
  }
  if (isShowMoreText(columnValue)) {
    return (
      <CustomShowMoreText
        truncatedEndingLenght={Math.floor(widthColumn / 9)}
        expanded={expandedText?.[row?.id]}
        value={columnValue}
      />
    );
  }
  return columnValue;
};
