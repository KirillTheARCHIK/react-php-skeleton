import React from "react";
import L from "leaflet";
import { useDispatch } from "react-redux";
import { LayerGroup, LayersControl, MapContainer, TileLayer, useMap, GeoJSON } from "react-leaflet";
import { useTheme } from "@mui/material/styles";

import { store } from "store/store";

import { URL } from "services/catalogs/monitoring";

import ZoomMapControl from "./control/ZoomMapControl";
import ClearControl from "./control/ClearControl";
import DraggableMarker from "./DraggableMarker";
import SettingsControl from "./control/SettingsControl";
import Points from "./Points";

import { clearMapParams, setMapParams } from "actions/mapParams";
import { TranslateEditGeozone } from "constants/translationMap";
import { DARK_THEME, LIGHT_THEME } from "constants/themes";
import markerImage from "images/png/marker/marker.png";

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import "./styles.css";
import { fetchRequest } from "helpers/fetchRequest";
import { markerIconBlue } from "./MarkerIcon";
import CustomLayerControl from "./control/CustomLayerControl";

L.Icon.Default.mergeOptions({
  iconUrl: markerImage,
  iconSize: [40, 40],
  shadowUrl: markerImage,
});

L.drawLocal = TranslateEditGeozone;

const TYPE_OBJECT = [
  { name: "Пикетный столбик", visible: true, data: null, disabled: false },
  { name: "Платформа", visible: true, data: null, disabled: false },
  {
    name: "Ось пути",
    visible: true,
    data: null,
    disabled: false,
    color: "green",
  },
  {
    name: "Остряк стрелочного перевода",
    visible: false,
    data: null,
    disabled: true,
  },
  {
    name: "Механизм стрелочного перевода Километровый столб",
    visible: false,
    data: null,
    disabled: true,
  },
  { name: "Конец пути", visible: false, data: null, disabled: true },
  {
    name: "Железнодорожный светофор",
    visible: false,
    data: null,
    disabled: true,
  },
  {
    name: "Пора контактной сети",
    visible: false,
    data: null,
    disabled: true,
  },
  {
    name: "Переездный настил через ЖД пути",
    visible: false,
    data: null,
    disabled: true,
  },
  { name: "Предельный столбик", visible: false, data: null, disabled: true },
  { name: "Тупиковая призма", visible: false, data: null, disabled: true },
  { name: "Карликовый светофор", visible: false, data: null, disabled: true },
  { name: "Мачтовый светофор", visible: false, data: null, disabled: true },
];

const DEFAULT_URL_MAP = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const FocusingTheGeofence = ({ polygons, id }) => {
  const map = useMap();
  React.useEffect(() => {
    if (id === 4 || polygons) {
      const newPolygon = L.geoJSON(polygons);
      map.fitBounds(newPolygon.getBounds());
    }
  }, [polygons, id]);
  return null;
};

export const fetchLocation = async (values, form) => {
  const response = await fetchRequest(`${URL}/point?` + new URLSearchParams({ ...values }));
  if (Array.isArray(response) && response.length) {
    const location = response[0];
    form.change("address", location.name);
    form.change("latitude", values.lat);
    form.change("longitude", values.lng);
    store.dispatch(setMapParams({ markerPosition: values }));
  } else {
    form.change("address", null);
    form.change("latitude", null);
    form.change("longitude", null);
  }
};

export const FocusingPoint = (points) => {
  const map = useMap();

  React.useEffect(() => {
    if (points.points.length) {
      const lat = points.points[0].latitude;
      const lng = points.points[0].longitude;
      const latLng = new L.LatLng(lat, lng);
      map.setView(latLng, 9);
    }
  }, [points]);
  return null;
};

const Map = ({
  styleMapContainer = {},
  className = "",
  isView,
  data = {},
  form,
  routingMachine,
  points,
  withClear,
  withSettings,
  withDraggableMarker,
  withRoutingMachineControl,
  withCenter,
  customAutofillFields,
  polygons = [],
  isEntrancePolygon,
  customRequestWhenSettingPoint,
  customClearForm,
  withLayers = false,
  id,
  platforms,
  customZoom,
  customCenter,
  focusPoint,
  dontSetView,
  tracks,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [visibleDraggableMarker, setVisibleDraggableMarker] = React.useState(false);
  const [polygonOnMap, setPolygonOnMap] = React.useState();
  const [layers, setLayers] = React.useState(TYPE_OBJECT);
  React.useEffect(() => {
    setLayers((prevLayers) => {
      return prevLayers.map((layer) => {
        if (layer.name === "Пикетный столбик") {
          return { ...layer, data: points };
        }
        if (layer.name === "Платформа") {
          return { ...layer, data: platforms };
        }
        if (layer.name === "Ось пути") {
          return { ...layer, data: tracks };
        }
        return layer;
      });
    });
  }, [points, platforms, tracks]);

  const handleLayerToggle = (layerName) => {
    setLayers((prevLayers) => prevLayers.map((layer) => (layer.name === layerName ? { ...layer, visible: !layer.visible } : layer)));
  };

  React.useEffect(() => {
    const leafletContainer = document.querySelector(".leaflet-container");
    const classNameLightMap = `${LIGHT_THEME}-map`;
    const classNameDarkMap = `${DARK_THEME}-map`;
    if (theme.palette.mode === LIGHT_THEME) {
      leafletContainer.classList.add(classNameLightMap);
      leafletContainer.classList.remove(classNameDarkMap);
    } else {
      leafletContainer.classList.add(classNameDarkMap);
      leafletContainer.classList.remove(classNameLightMap);
    }
    return () => {
      dispatch(clearMapParams());
    };
  }, [theme.palette.mode]);
  return (
    <MapContainer
      className={className}
      style={{
        height: "100vh",
        maxHeight: "calc(100vh - 85px)",
        borderRadius: 10,
        width: "100%",
        ...styleMapContainer,
      }}
      center={customCenter ?? [53.407712, 58.975213]}
      zoom={customZoom ?? 17}
      zoomControl={false}
      maxBoundsViscosity={1}
    >
      <TileLayer url={DEFAULT_URL_MAP} maxZoom={30} maxNativeZoom={19} />
      {withLayers ? (
        // TODO: Вынести
        <>
          <CustomLayerControl layers={layers} onLayerToggle={handleLayerToggle} />
          <LayersControl position="topright">
            {layers.map(
              (layer) =>
                layer.visible && (
                  <LayersControl.Overlay checked name={layer.name} key={layer.name}>
                    {layer.name === "Пикетный столбик" ? (
                      <LayerGroup>
                        {points ? (
                          <Points
                            form={form}
                            points={points}
                            customAutofillFields={visibleDraggableMarker ? customAutofillFields : null}
                            markerIconCustom={markerIconBlue}
                            dontSetView
                          />
                        ) : null}
                      </LayerGroup>
                    ) : (
                      <LayerGroup>
                        {layer.data ? <GeoJSON data={layer.data} style={layer.color ? { color: layer.color } : {}} /> : null}
                      </LayerGroup>
                    )}
                  </LayersControl.Overlay>
                )
            )}
          </LayersControl>
        </>
      ) : null}
      <ZoomMapControl />
      {/* {withRuler ? <LeafletRuler /> : null} */}
      {withClear ? (
        <ClearControl
          form={form}
          isView={isView}
          customClearForm={customClearForm}
          setVisibleDraggableMarker={setVisibleDraggableMarker}
          setPolygonOnMap={setPolygonOnMap}
        />
      ) : null}
      {withSettings ? <SettingsControl /> : null}
      {withDraggableMarker || visibleDraggableMarker ? (
        <DraggableMarker
          form={form}
          data={data}
          isView={isView}
          isEntrancePolygon={visibleDraggableMarker && polygons.length > 0 ? isEntrancePolygon : false}
          withDraggableMarker={withDraggableMarker}
          polygons={polygonOnMap}
          customRequestWhenSettingPoint={customRequestWhenSettingPoint}
        />
      ) : null}

      {withCenter ? <FocusingTheGeofence polygons={platforms} id={id} /> : null}
      {focusPoint && focusPoint.length > 0 ? <FocusingPoint points={focusPoint} /> : null}
      {withRoutingMachineControl ? (
        // <RoutingMachineControl waypoints={routingMachine.points} />
        <Points
          form={form}
          points={routingMachine.points}
          dontSetView={dontSetView}
          // customAutofillFields={
          //   visibleDraggableMarker ? customAutofillFields : null
          // }
          // markerIconCustom={markerIconBlue}
        />
      ) : null}
    </MapContainer>
  );
};

export default Map;
