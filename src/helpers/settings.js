export const getRefreshTime = (value) => {
  return +value * 60000;
};

export const getDataRefreshTime = (value = 10) => {
  return +value * 1000;
};
