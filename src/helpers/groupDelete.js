export function groupDelete(idArray, isAll) {
  const searchParams = new URLSearchParams();
  if (isAll) {
    searchParams.append("all", isAll);
    return searchParams;
  }
  if (Array.isArray(idArray)) {
    idArray.forEach((id) => searchParams.append("ids[]", id));
  } else {
    searchParams.append("ids[]", idArray);
  }
  return searchParams;
}

export const groupDeleteCalendarItem = (
  url,
  calendarId,
  calendarType,
  idArray,
  isAll
) => {
  if (isAll) {
    return (
      `${url}?` +
      new URLSearchParams({ id: calendarId, type: calendarType, all: isAll })
    );
  }
  return `${url}?${groupDelete(idArray, isAll)}`;
};
