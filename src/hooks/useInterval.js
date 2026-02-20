import React from "react";

export function useInterval(cb, ms) {
  React.useEffect(() => {
    const id = setInterval(cb, ms);
    return () => clearInterval(id);
  }, [cb, ms]);
}
