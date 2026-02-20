import React from "react";
import Control from "react-leaflet-custom-control";
import CustomButton from "components/Map/CustomButton";

const SettingsControl = () => {
  return (
    <Control position="topright">
      <CustomButton
        iconName={"tune"}
        sx={{
          width: 50,
          height: 50,
          minWidth: 0,
          paddingLeft: "28px",
          marginTop: "60px",
          marginRight: 0,
        }}
      />
    </Control>
  );
};

export default SettingsControl;
