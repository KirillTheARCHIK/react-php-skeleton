import React, { useState, useEffect } from "react";
import moment from "moment";
import Box from "@mui/material/Box";

const formatDate = (value) => {
  if (value) return moment(value).format("HH:mm:ss DD.MM.YYYY");
};

const DateTime = () => {
  const [timeDate, setTimeDate] = useState(formatDate(new Date()));

  useEffect(() => {
    const interval = setInterval(renderTimeDate, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderTimeDate = () => {
    setTimeDate(formatDate(new Date()));
  };

  return (
    <Box
      component="div"
      sx={{
        width: 80,
        fontSize: 14,
        textAlign: "center",
      }}
    >
      {timeDate}
    </Box>
  );
};

export default DateTime;
