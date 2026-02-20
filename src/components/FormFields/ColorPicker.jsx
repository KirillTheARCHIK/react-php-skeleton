import React from "react";
import { RgbaStringColorPicker } from "react-colorful";
import { styled } from "@mui/material/styles";
import { getColorRgb } from "helpers/format";

const ColorPicker = ({ input }) => {
  const rgbaString = React.useMemo(() => {
    return input.value.startsWith("rgba") ? input.value : getColorRgb(input.value);
  }, [input.value]);

  return <StyledColorPicker color={rgbaString} onChange={(value) => input.onChange(value)} />;
};
function styles() {
  return {
    fontFamily: "'Helvetica', sans-serif",
    marginBottom: "15px",
    width: "100% !important",
    "& .react-colorful__pointer": {
      width: "16px",
      height: "16px",
      borderRadius: "20px",
    },
    "& .react-colorful__hue": {
      height: "16px",
      borderRadius: "5px",
      margin: "15px 0",
    },
    "& .react-colorful__saturation": {
      width: "100%",
      height: "100%",
      borderRadius: "5px",
      borderBottom: "none",
    },
    "& .react-colorful__alpha": {
      height: "16px",
      borderRadius: "5px",
      margin: "15px 0",
    },
  };
}

const StyledColorPicker = styled(RgbaStringColorPicker)(styles);

export default ColorPicker;
