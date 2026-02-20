import React from "react";
import { Badge, Tooltip } from "@mui/material";

const TabLabelWithBadge = ({
  badgeContent,
  title,
  titleTooltip,
  maxValueBadge,
}) => {
  return (
    <Tooltip title={titleTooltip}>
      <Badge
        badgeContent={badgeContent}
        color="primary"
        max={maxValueBadge}
        showZero
      >
        {title}
      </Badge>
    </Tooltip>
  );
};

export default TabLabelWithBadge;
