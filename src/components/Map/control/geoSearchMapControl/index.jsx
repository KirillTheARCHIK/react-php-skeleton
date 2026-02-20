import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl } from "leaflet-geosearch";

import CustomProvider from "./CustomProvider";

const GeoSearchMapControl = ({ form, isDraggable }) => {
  const map = useMap();

  const searchControl = new GeoSearchControl({
    provider: new CustomProvider(),
    style: "bar",
    searchLabel: "Введите адрес",
    autoComplete: true,
    marker: {
      draggable: isDraggable,
    },
  });

  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [searchControl]);

  const onShowLocation = ({ location, marker }) => {
    if (form) {
      const latLng = marker.getLatLng();
      form.change("address", location.label);
      form.change("latitude", latLng.lat);
      form.change("longitude", latLng.lng);
    }
  };

  const onDragendMarker = ({ location }) => {
    if (form) {
      form.change("latitude", location.lat);
      form.change("longitude", location.lng);
    }
  };

  map.on("geosearch/showlocation", onShowLocation);

  map.on("geosearch/marker/dragend", onDragendMarker);

  return null;
};
export default GeoSearchMapControl;
