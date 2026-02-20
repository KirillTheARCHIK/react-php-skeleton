import React from "react";

import Control from "react-leaflet-custom-control";

import CustomButton from "components/Map/CustomButton";

const CreatePointControl = ({ setVisibleDraggableMarker }) => {
  return (
    <Control position="topRight">
      <CustomButton
        value={"Поставить МТ"}
        iconName={"marker"}
        sx={{ width: "auto" }}
        onClick={() => {
          setVisibleDraggableMarker((prevValue) => !prevValue);
        }}
      ></CustomButton>
    </Control>
  );
};

export default CreatePointControl;
