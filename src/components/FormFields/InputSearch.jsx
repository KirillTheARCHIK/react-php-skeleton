import { useTheme } from "@mui/material";
import Input from "components/FormFields/Input";
import Icon from "components/Icon";
import { LIGHT_THEME } from "constants/themes";

export default function InputSearch({ sx, ...props }) {
  const theme = useTheme();

  return (
    <Input
      className="input--search"
      {...props}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        startAdornment: (
          <Icon
            name="search"
            sx={{
              fill: theme.palette.mode === LIGHT_THEME ? "#CACCCF" : "#FFFFFF",
            }}
          />
        ),
      }}
      sx={{
        ...styles,
        ...sx,
      }}
    />
  );
}

const styles = {
  "&.input--search": {
    "& .MuiInputLabel-outlined": {
      fontSize: "13px",
      lineHeight: "16px",
      height: "16px",
      transform: "translate(15px, 9px) scale(1)",
      "&.Mui-focused": {
        transform: "translate(15px, -9px) scale(1)",
      },
      "&.MuiInputLabel-shrink": {
        transform: "translate(15px, -9px) scale(1)",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: "13px",
      lineHeight: "16px",
      height: "16px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      "& legend": {
        fontSize: "13px",
      },
    },
    "& .MuiOutlinedInput-root": {
      "& .MuiOutlinedInput-input": {
        fontSize: "13px",
        lineHeight: "16px",
        padding: "9px 10px",
      },
      "& svg": {
        height: "14px",
        width: "14px",
      },
      "&.MuiInputBase-adornedStart": {
        "& > svg ": {
          height: "14px",
          width: "14px",
        },
      },
      "&.MuiInputBase-adornedEnd": {
        "& > svg ": {
          height: "14px",
          width: "14px",
        },
      },
    },
  },
};
