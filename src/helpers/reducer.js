export const renderValues = (values, payload) => {
  return Object.keys(values).reduce((acc, current) => {
    if (!payload.includes(+current)) {
      acc[current] = values[current];
    }
    return acc;
  }, {});
};
