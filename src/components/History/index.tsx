import { setHistorySingleton } from "App";
import React from "react";
import { useHistory } from "react-router-dom";

const History = () => {
  const history = useHistory();

  React.useEffect(() => {
    setHistorySingleton(history);
  }, [history]);

  return null;
};

export default History;
