import React, { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";

import Input from "components/FormFields/Input";
import Icon from "components/Icon";

const InputPassword = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon name="loginLock" fontSize="small" sx={{ fill: "none" }} />
          </InputAdornment>
        ),
        endAdornment: (
          <IconButton
            aria-label="toggle password visibility"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <Icon
                name="passwordView"
                fontSize="small"
                sx={{ fill: "none" }}
              />
            ) : (
              <Icon
                name="passwordNotView"
                fontSize="small"
                sx={{ fill: "none" }}
              />
            )}
          </IconButton>
        ),
        ...props.InputProps,
      }}
    />
  );
};

export default InputPassword;
