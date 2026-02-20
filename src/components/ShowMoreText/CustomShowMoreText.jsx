import React from "react";
import { Tooltip } from "@mui/material";

const CustomShowMoreText = ({ value, expanded }) => {
  const renderValue = () => {
    if (expanded) return value;
    return (
      <Tooltip title={value}>
        <div>{value}</div>
      </Tooltip>
    );
  };
  return <>{renderValue()}</>;
};

CustomShowMoreText.defaultProps = {
  truncatedEndingLenght: 14,
  value: "",
  expanded: false,
};

export default CustomShowMoreText;
