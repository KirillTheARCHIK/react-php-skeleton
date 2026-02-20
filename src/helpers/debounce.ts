export const debounce = (func: (...args: never[]) => void, timeoutMs = 500) => {
  let timer: NodeJS.Timeout | null;
  return (...args: never[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(this, args);
    }, timeoutMs);
  };
};
