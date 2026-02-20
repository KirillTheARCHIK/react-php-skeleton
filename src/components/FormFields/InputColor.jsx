import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Popover from "@mui/material/Popover";
import { styled } from "@mui/material/styles";
import { bindPopover, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import Button from "components/Button";
import ColorPicker from "components/FormFields/ColorPicker";

import { LIGHT_THEME } from "constants/themes";

const InputColor = ({ label, input, disabled = true }) => {
  const popupState = usePopupState({
    variant: "popover",
  });

  return (
    <Grid container alignItems="center" gap={2} sx={{ margin: "0 0 25px 0" }}>
      <Grid item xs>
        <StyledTypography className={disabled && "disabled"}>{label}</StyledTypography>
      </Grid>
      <Grid item>
        <Button
          {...bindTrigger(popupState)}
          variant="contained"
          size="small"
          sx={{
            width: "80px",
            backgroundColor: input.value,
            "&:hover": {
              backgroundColor: input.value,
            },
          }}
        />
        {!disabled && (
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Box sx={{ padding: "16px", width: "264px" }}>
              <ColorPicker input={input} />
            </Box>
          </Popover>
        )}
      </Grid>
    </Grid>
  );
};

export function inputStyles({ theme }) {
  const inputLabelColor = theme.palette.mode === LIGHT_THEME ? "#004E9E" : "#EA973E";
  const inputLabelDisabledColor = theme.palette.mode === LIGHT_THEME ? "#868686" : "#919191";

  return {
    fontFamily: "'Helvetica', sans-serif",
    fontSize: "16px",
    lineHeight: "18px",
    height: "18px",
    fontWeight: 700,
    color: inputLabelColor,
    "&.disabled": {
      color: inputLabelDisabledColor,
    },
  };
}

const StyledTypography = styled(Typography)(inputStyles);

export default InputColor;
