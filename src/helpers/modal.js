export const getTitleModal = (isView, isEdit) => {
  if (isView) return "Просмотр";
  if (isEdit) return "Редактирование";
  return "Создание";
};
