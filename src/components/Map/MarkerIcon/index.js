import L from "leaflet";
import markerImage from "images/png/marker/marker.png";
import markerImageBlue from "images/png/marker/marker_blue.png";
import markerImageGreen from "images/png/marker/marker_green.png";

export const markerIcon = new L.Icon({
  iconUrl: markerImage,
  iconSize: [40, 40],
});

export const markerIconBlue = new L.Icon({
  iconUrl: markerImageBlue,
  iconSize: [40, 40],
});

export const markerIconGreen = new L.Icon({
  iconUrl: markerImageGreen,
  iconSize: [40, 40],
});
