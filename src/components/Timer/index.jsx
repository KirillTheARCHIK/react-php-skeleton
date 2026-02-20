import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { momentFormatTime } from "helpers/date";

const Timer = ({
  value,
  reverseTimer = false,
  customCountingUp = false,
  stopped = false,
}) => {
  const [currentSeconds, setCurrentSeconds] = useState(null);
  const currentTimer = useRef(null);

  useEffect(() => {
    setCurrentSeconds(value);
  }, [value]);

  useEffect(() => {
    if (!stopped) {
      currentTimer.current = setInterval(() => {
        if (reverseTimer) {
          setCurrentSeconds((prevCount) => prevCount - 1);
        } else setCurrentSeconds((prevCount) => prevCount + 1);
      }, 1000);
    }

    return () => {
      if (currentTimer.current) clearInterval(currentTimer.current);
    };
  }, [stopped]);

  const getValueTimer = () => {
    if (currentSeconds === 0) {
      return "00:00";
    }
    return momentFormatTime(Math.abs(currentSeconds));
  };

  return (
    <div>
      <Box
        sx={{ color: customCountingUp ? "red" : null }}
      >
        {currentSeconds < 0 && reverseTimer ? "-" : ""}
        {getValueTimer()}
      </Box>
    </div>
  );
};

export default Timer;
