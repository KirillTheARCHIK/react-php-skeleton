import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCompleteUserTask, setProcessingUserTask, setProgressUserTask } from "actions/catalogs/userTasks";

let eventSource = null;
const url = "/api/v1/catalogs/user_tasks/progress";

const getData = (event) => {
  const data = JSON.parse(event?.data);
  const [key, value] = Object.entries(data)[0];
  return { [key]: Number(value) };
};

export default function useUserTasks(onClose = () => {}) {
  const dispatch = useDispatch();

  const onProgress = useCallback(
    (event) => {
      dispatch(setProgressUserTask(getData(event)));
    },
    [dispatch]
  );

  const onProcessing = useCallback(
    (event) => {
      dispatch(setProcessingUserTask(getData(event)));
    },
    [dispatch]
  );

  const onComplete = useCallback(
    (event) => {
      dispatch(setCompleteUserTask(getData(event)));
    },
    [dispatch]
  );

  const onError = useCallback(() => {
    eventSource.close();
    onClose();
  }, [onClose]);

  const [connected, setConnected] = useState(eventSource?.readyState !== EventSource.CLOSED);
  const [timeoutId, setTimeoutId] = useState(null);

  const connect = useCallback(() => {
    if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
      eventSource.close();
    }
    setConnected(false);

    setTimeoutId(
      setTimeout(() => {
        eventSource = new EventSource(url, {
          withCredentials: true,
        });
        setConnected(true);
        setTimeoutId(null);
      }, 1000)
    );
  }, []);

  useEffect(() => {
    if (connected && eventSource) {
      eventSource.addEventListener("progress", onProgress);
      eventSource.addEventListener("processing", onProcessing);
      eventSource.addEventListener("complete", onComplete);
      eventSource.onerror = onError;
    }
    return () => {
      if (eventSource) {
        eventSource.removeEventListener("progress", onProgress);
        eventSource.removeEventListener("processing", onProcessing);
        eventSource.removeEventListener("complete", onComplete);
        eventSource.onerror = null;
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [connected, onComplete, onError, onProcessing, onProgress, timeoutId]);

  return connect;
}
