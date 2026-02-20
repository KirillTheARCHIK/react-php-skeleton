import React from "react";
import ShowMoreText from "react-show-more-text";

import IconButton from "components/IconButton";

const ShowMoreTextComponent = ({ children, lines }) => {
  return (
    <ShowMoreText
      lines={lines}
      more={
        <IconButton
          name="arrowRight"
          size="small"
          title="Раскрыть"
          color="primary"
          sx={{ p: "2px" }}
        />
      }
      less={
        <IconButton
          name="arrowLeft"
          title="Скрыть"
          size="small"
          color="primary"
          sx={{ p: "2px" }}
        />
      }
    >
      {children}
    </ShowMoreText>
  );
};

ShowMoreTextComponent.defaultProps = {
  lines: 1,
  children: null,
};

export default ShowMoreTextComponent;
