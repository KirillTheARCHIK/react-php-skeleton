import { useMemo } from "react";
import { FormControl, FormControlLabel, Radio, RadioGroup, useRadioGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LIGHT_THEME } from "constants/themes";

function styles({ theme, checked }) {
  const radioFontColor = theme.palette.mode === LIGHT_THEME ? "#3B82F6" : "#FFFFFF";
  const radioFontColorChecked = theme.palette.mode === LIGHT_THEME ? "#004E9E" : "#FFFFFF";
  const radioColor = theme.palette.mode === LIGHT_THEME ? "#CBD5E1" : "#FFFFFF";
  const radioBgColor = theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#353535";
  const radioColorChecked = theme.palette.mode === LIGHT_THEME ? "#004E9E" : "#EA973E";
  const radioColorHover = theme.palette.mode === LIGHT_THEME ? "#B3D4F5" : "rgba(234, 151, 62, 0.7)";
  return {
    "& .MuiFormControlLabel-label": {
      fontFamily: "Helvetica",
      fontSize: "16px",
      lineHeight: "20px",
      color: checked ? radioFontColorChecked : radioFontColor,
    },
    "& .MuiButtonBase-root": {
      "&:hover": {
        backgroundColor: "initial",
      },
      "& svg": {
        display: "none",
      },
      "& input ~ span": {
        borderRadius: "50%",
        width: "16px",
        height: "16px",
        backgroundColor: radioColor,
        "&:before": {
          display: "block",
          width: "16px",
          height: "16px",
          backgroundImage: `radial-gradient(circle at center, ${radioBgColor} 50%, transparent 60%)`,
          content: '""',
        },
      },
      "& input:hover ~ span": {
        backgroundColor: radioColorHover,
        "&:before": {
          backgroundImage: `radial-gradient(circle at center, ${radioBgColor} 35%, transparent 45%)`,
        },
      },
      "& input:checked ~ span": {
        backgroundColor: radioColorChecked,
        "&:before": {
          backgroundImage: "radial-gradient(circle at center, #FFFFFF 35%, transparent 45%)",
        },
      },
    },
  };
}

const StyledFormControlLabel = styled(FormControlLabel)(styles);

export function RadioButton({ value, label, labelPlacement, name, size, disabled, ...props }) {
  const radioGroup = useRadioGroup();

  const checked = useMemo(() => (value === undefined ? undefined : radioGroup?.value === value), [value, radioGroup]);

  return (
    <StyledFormControlLabel
      value={value}
      checked={checked}
      control={<Radio size={size} disableRipple color="default" />}
      label={label}
      labelPlacement={labelPlacement}
      name={name}
      disabled={disabled}
      {...props}
    />
  );
}

export function RadioGroupComponent({ value, children, onChange, isRow }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <FormControl>
      <RadioGroup row={isRow} value={value} onChange={handleChange}>
        {children}
      </RadioGroup>
    </FormControl>
  );
}

RadioButton.defaultProps = {
  name: "radio",
  children: null,
  onChange: () => {},
  labelPlacement: "end",
  size: "medium",
  disabled: false,
};

RadioGroupComponent.defaultProps = {
  children: null,
  onChange: () => {},
  isRow: true,
};

export default RadioGroupComponent;
