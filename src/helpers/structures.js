/**
 * Возвращает диапазон (возрастающую арифметическую прогрессию) [start; end)
 * с шагом step в виде массива
 */
export const range = (start, end, step = 1) => {
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};
