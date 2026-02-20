import React, { useEffect } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { useTheme } from "@mui/material/styles";
import { LIGHT_THEME } from "constants/themes";

const InputMentions = ({ data, input, disabled }) => {
  const theme = useTheme();
  const [value, setValue] = React.useState("");

  useEffect(() => {
    setValue(input.value);
  }, [input.value]);

  const getColor = () => {
    if (disabled)
      return theme.palette.mode === LIGHT_THEME
        ? "rgba(0, 0, 0, 0.38)"
        : "rgba(255, 255, 255, 0.5)";
    return theme.palette.mode === LIGHT_THEME ? "rgba(0, 0, 0, 0.87)" : "#fff";
  };

  const defaultStyle = {
    control: {
      backgroundColor:
        theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#121212",
      backgroundImage:
        theme.palette.mode === LIGHT_THEME
          ? "none"
          : "linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))",
      fontFamily: "'Helvetica', sans-serif",
      fontSize: 12,
      fontWeight: "normal",
      marginBottom: "25px",
    },

    "&multiLine": {
      control: {
        minHeight: 80,
      },
      highlighter: {
        padding: "11.5px 10px",
      },
      input: {
        color: getColor(),

        padding: "11.5px 8px",
        border:
          theme.palette.mode === LIGHT_THEME
            ? "2px solid rgb(211, 211, 211)"
            : "2px solid rgb(255, 255, 255)",
        borderRadius: "4px",
        "&focused": {
          border: "none",
        },
      },
      textarea: {
        color: "red",
      },
    },

    "&singleLine": {
      highlighter: {
        padding: "11.5px 10px",
      },
      input: {
        minHeight: 40,
        height: 40,
        color:
          theme.palette.mode === LIGHT_THEME ? "rgba(0, 0, 0, 0.87)" : "#fff",
        padding: "11.5px 8px",
        border:
          theme.palette.mode === LIGHT_THEME
            ? "2px solid rgb(211, 211, 211)"
            : "2px solid rgb(255, 255, 255)",
        borderRadius: "4px",
        "&focused": {
          border: "none",
        },
      },
    },

    suggestions: {
      list: {
        backgroundColor:
          theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#121212",
        backgroundImage:
          theme.palette.mode === LIGHT_THEME
            ? "none"
            : "linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))",
        border: "1px solid rgba(0,0,0,0.15)",
        fontSize: 14,
      },
      item: {
        padding: "5px 15px",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
        "&focused": {
          backgroundColor:
            theme.palette.mode === LIGHT_THEME ? "#C5E1FF" : "#EA973E",
        },
      },
    },
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    input.onChange(newValue);
  };

  return (
    <MentionsInput
      style={defaultStyle}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder="Используйте # для выбора тега"
    >
      <Mention
        trigger="#"
        markup="#[__display__](__id__)"
        displayTransform={(id, display) => `#${display}`}
        data={data}
        appendSpaceOnAdd
      />
    </MentionsInput>
  );
};

InputMentions.defaultProps = {
  data: [],
};

export default InputMentions;
