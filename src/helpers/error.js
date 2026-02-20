export const showError = (openAlert, error) => {
  if (error) {
    return openAlert("error", error);
  }
  return openAlert("error", "Непредвиденная ошибка");
};
