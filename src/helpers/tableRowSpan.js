import { LIGHT_THEME } from "constants/themes";

// interface TableRowSpanOptions {
//   spanningColumns: string[],
//   isRowsSpanning: (a: {}, b: {}) => boolean,
// }

export const getRowsWithSpan = (rows, tableRowSpanOptions, themeMode) => {
  let lastSpanRowIndex;
  let isOdd = false;
  for (let i = 0; i < rows.length; i++) {
    if (i === 0 || !tableRowSpanOptions.isRowsSpanning(rows[i - 1], rows[i])) {
      lastSpanRowIndex = i;
      isOdd = !isOdd;
      rows[lastSpanRowIndex].rowSpan = 1;
    } else {
      rows[lastSpanRowIndex].rowSpan++;
    }
    if (isOdd) {
      rows[i].bgColorSpanRow =
        themeMode === LIGHT_THEME ? "#FFFFFF !important" : "#202020 !important";
    } else {
      rows[i].bgColorSpanRow =
        themeMode === LIGHT_THEME ? "#F5F5F5 !important" : "#1B1A1A !important";
    }
  }
  return rows;
};
