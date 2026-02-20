import React, { useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { markerIcon, markerIconGreen } from "components/Map/MarkerIcon";

import L from "leaflet";
import { Box } from "@mui/material";
import Button from "components/Button";

const Points = ({
  points = [],
  form,
  customAutofillFields,
  markerIconCustom,
  dontSetView,
}) => {
  const map = useMap();
  const [currentMarker, setCurrentMarker] = useState(null);

  React.useEffect(() => {
    if (points.length) {
      const lat = points[0].latitude;
      const lng = points[0].longitude;
      const latLng = new L.LatLng(lat, lng);

      if (!dontSetView) map.setView(latLng);
    }
  }, [points]);

  const setStyleMarker = (element) => {
    if (currentMarker) currentMarker.style.border = "none";
    element.style.border = "dashed 2px #FF1493";
    setCurrentMarker(element);
  };

  return (
    <>
      {points.map((value, index) => (
        <Marker
          key={index}
          position={[value.latitude, value.longitude]}
          icon={
            markerIconCustom ||
            (value.customIcon ? markerIconGreen : markerIcon)
          }
          eventHandlers={{
            click: (event) => {
              const popup = event.target.getPopup();

              if (form) {
                if (customAutofillFields) {
                  customAutofillFields(value, form);
                }

                setStyleMarker(event.target.getElement());
                form.change("address", popup.options.children);
                form.change("latitude", event.latlng.lat);
                form.change("longitude", event.latlng.lng);
                map.setView([event.latlng.lat, event.latlng.lng]);
              }
            },
          }}
        >
          {value ? (
            <Popup autoPan={false}>
              {value.address ? (
                <Box>{`Тип: ${value.address?.name ?? value.address}`}</Box>
              ) : null}
              {value.name ? <Box>{`Станция: ${value?.name}`}</Box> : null}
              <Box>{`Широта: ${value.latitude}`}</Box>
              <Box>{`Долгота: ${value.longitude}`}</Box>
              {value.basename ? (
                <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                  <Button
                    onClick={() => value.onView(value)}
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Просмотр
                  </Button>
                </Box>
              ) : null}
            </Popup>
          ) : null}
        </Marker>
      ))}
    </>
  );
};

export default Points;
