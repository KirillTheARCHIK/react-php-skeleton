import React from "react";
import { ZoomControl } from "react-leaflet";

const ZoomMapControl = () => {
  return (
    <ZoomControl
      position="topleft"
      zoomInTitle={"Увеличение масштаба карты"}
      zoomOutTitle={"Уменьшение масштаба карты"}
    />
  );
};

export default ZoomMapControl;
