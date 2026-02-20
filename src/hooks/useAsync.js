import { useCallback, useRef, useState } from "react";

/**
 * @typedef {Object} UseAsyncResult
 * @property {any} error ошибка
 * @property {boolean} loading состояние загрузки
 * @property {any} value результат вызова
 * @property {function} execute мемоизированный колбэк
 * @property {function} setValue сеттер состояния
 * @property {function} setError сеттер ошибки
 */

/**
 * Хук, который принимает асинхронную функцию и возвращает объект с ее
 * мемоизированной версией, со статусом загрузки, состоянием ошибки и
 * результатом ее вызова.
 *
 * @param callback функция, для которой необходимо получить состояние
 * @param {"stale-while-revalidate"|"must-revalidate"} cache стратегия
 * кеширования результата вызова callback
 * @return {UseAsyncResult}
 */
export const useAsync = (callback, cache = "stale-while-revalidate") => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [value, setValue] = useState();

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const execute = useCallback((...args) => {
    setLoading(true);
    setError(undefined);
    if (cache === "must-revalidate") {
      setValue(undefined);
    }
    callbackRef
      .current(...args)
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { error, loading, value, execute, setValue, setError };
};
